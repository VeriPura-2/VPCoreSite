#!/usr/bin/env python3
"""
VeriPura Local FTP Deployer
Syncs website files to the remote FTP server.
"""

import os
import sys
import json
import hashlib
from ftplib import FTP, FTP_TLS

EXCLUDED_FILES = {
    "deploy.py",
    "deploy.sh",
    "deploy.yml",
    "README.md",
    "STYLE_GUIDE.md",
    ".env",
    ".env.example",
    ".deploy-cache.json",
    ".gitignore",
    ".DS_Store",
}

EXCLUDED_DIRS = {
    ".git",
    ".github",
    "__pycache__",
}

CACHE_FILE = ".deploy-cache.json"

def load_env(env_path=".env"):
    config = {}
    if not os.path.exists(env_path):
        return None
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            config[k.strip()] = v.strip().strip("'\"")
    return config

def get_file_hash(filepath):
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def ensure_remote_dir(ftp, remote_path):
    dirs = [d for d in remote_path.split("/") if d]
    current = ""
    for d in dirs:
        current += "/" + d
        try:
            ftp.cwd(current)
        except Exception:
            try:
                ftp.mkd(current)
                ftp.cwd(current)
            except Exception:
                pass

def main():
    force_all = "--all" in sys.argv

    config = load_env()
    if not config:
        print("\n❌ Error: .env file not found!")
        print("Please create a .env file with your FTP credentials.")
        print("You can copy .env.example to get started:\n")
        print("  cp .env.example .env\n")
        sys.exit(1)

    server = config.get("FTP_SERVER")
    username = config.get("FTP_USERNAME")
    password = config.get("FTP_PASSWORD")
    port = int(config.get("FTP_PORT", 21))
    server_dir = config.get("FTP_SERVER_DIR", "public_html/").strip("/")
    use_tls = config.get("FTP_TLS", "false").lower() in ("true", "1", "yes")

    if not server or not username or not password:
        print("\n❌ Error: FTP_SERVER, FTP_USERNAME, and FTP_PASSWORD must all be defined in .env.")
        sys.exit(1)

    # Load cache of previous uploads
    cache = {}
    if os.path.exists(CACHE_FILE) and not force_all:
        try:
            with open(CACHE_FILE, "r", encoding="utf-8") as f:
                cache = json.load(f)
        except Exception:
            cache = {}

    print(f"📡 Connecting to {server}:{port} as {username}...")
    try:
        if use_tls:
            ftp = FTP_TLS()
            ftp.connect(server, port, timeout=30)
            ftp.login(username, password)
            ftp.prot_p()
        else:
            ftp = FTP()
            ftp.connect(server, port, timeout=30)
            ftp.login(username, password)
        print("✅ Connected successfully.\n")
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        sys.exit(1)

    # Target remote directory
    initial_dir = ftp.pwd()
    if server_dir:
        try:
            ftp.cwd(server_dir)
            target_base = ftp.pwd()
        except Exception:
            try:
                ftp.cwd(f"/{server_dir}")
                target_base = ftp.pwd()
            except Exception:
                ensure_remote_dir(ftp, server_dir)
                target_base = ftp.pwd()
    else:
        target_base = initial_dir

    print(f"📁 Target remote directory: {target_base}")

    root_dir = os.path.abspath(os.path.dirname(__file__))
    uploaded = 0
    skipped = 0
    new_cache = {}

    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Exclude directories
        dirnames[:] = [d for d in dirnames if d not in EXCLUDED_DIRS and not d.startswith(".")]

        rel_dir = os.path.relpath(dirpath, root_dir)
        if rel_dir == ".":
            remote_rel_dir = ""
        else:
            remote_rel_dir = rel_dir.replace("\\", "/")

        for filename in filenames:
            if filename in EXCLUDED_FILES or filename.startswith("."):
                continue

            local_file = os.path.join(dirpath, filename)
            rel_file = os.path.relpath(local_file, root_dir).replace("\\", "/")
            file_hash = get_file_hash(local_file)
            new_cache[rel_file] = file_hash

            if not force_all and cache.get(rel_file) == file_hash:
                skipped += 1
                continue

            remote_path = f"{target_base}/{remote_rel_dir}".rstrip("/") if remote_rel_dir else target_base

            # Ensure remote subfolder exists
            ensure_remote_dir(ftp, remote_path)
            ftp.cwd(remote_path)

            print(f"  ⬆️  Uploading {rel_file}...")
            with open(local_file, "rb") as f:
                ftp.storbinary(f"STOR {filename}", f)
            uploaded += 1

    # Save updated cache
    with open(CACHE_FILE, "w", encoding="utf-8") as f:
        json.dump(new_cache, f, indent=2)

    try:
        ftp.quit()
    except Exception:
        pass

    print(f"\n🎉 Deployment finished! {uploaded} uploaded, {skipped} unchanged.")

if __name__ == "__main__":
    main()
