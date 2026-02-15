#!/bin/bash
# ============================================
# VPS Hardening Script for FindAutoPart
# Run as root on a fresh VPS before deploying
# ============================================

set -e

echo "🔒 Starting VPS hardening..."

# 1. System updates
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# 2. UFW Firewall
echo "🛡️ Configuring firewall..."
apt install ufw -y
ufw default deny incoming
ufw default allow outgoing

# Allow only necessary ports
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP (redirect to HTTPS)'
ufw allow 443/tcp comment 'HTTPS'

# Block internal service ports explicitly
ufw deny 5432/tcp comment 'PostgreSQL - blocked'
ufw deny 6379/tcp comment 'Redis - blocked'
ufw deny 7700/tcp comment 'Meilisearch - blocked'
ufw deny 9000/tcp comment 'MinIO API - blocked'
ufw deny 9001/tcp comment 'MinIO Console - blocked'
ufw deny 8080/tcp comment 'Traefik Dashboard - blocked'

ufw --force enable

# 3. SSH Hardening
echo "🔑 Hardening SSH..."
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

cat >> /etc/ssh/sshd_config << 'EOF'

# === FindAutoPart Security Hardening ===
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
Protocol 2
X11Forwarding no
PermitEmptyPasswords no
EOF

systemctl restart sshd

# 4. Fail2Ban
echo "🚫 Installing Fail2Ban..."
apt install fail2ban -y

cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
logpath = %(sshd_log)s
maxretry = 3
EOF

systemctl enable fail2ban
systemctl start fail2ban

# 5. Automatic security updates
echo "🔄 Enabling automatic security updates..."
apt install unattended-upgrades -y
dpkg-reconfigure -plow unattended-upgrades

echo ""
echo "✅ VPS hardening complete!"
echo ""
echo "⚠️  IMPORTANT: Before logging out, make sure you can SSH with your key!"
echo "    Test in another terminal: ssh your_user@your_server"
echo ""
