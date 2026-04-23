#!/bin/bash
set -e

# Initialize Terraform and apply
terraform init
terraform apply -auto-approve

# Get EC2 public IP
IP=$(terraform output -raw ec2_public_ip)
echo "EC2 public IP: $IP"

# Generate hosts.ini for Ansible
cat <<EOF > hosts.ini
[ec2]
$IP ansible_user=ubuntu ansible_ssh_private_key_file=/home/koba/project/MyKeyPair.pem 
EOF

# Deploy site via Ansible
ansible-playbook -i hosts.ini deploy-site.yml

echo "DONE. Open site in browser: http://$IP"
