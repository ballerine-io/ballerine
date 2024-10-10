# Configuration - AWS base image
variable "base_ami" {
  type    = string
  default = "ami-01e444924a2233b07" # Ubuntu 22.04.2 LTS
}

# Configuration - AWS provisioning instance type
variable "instance_type" {
  type    = string
  default = "t2.micro"
}

# Configuration - AWS subnet
variable "subnet_id" {
  type    = string
  default = "subnet-01d1b883a41235506"
}

# Configuration - AWS VPC
variable "vpc_id" {
  type    = string
  default = "vpc-0ed0113663b1fbf40"
}


# "timestamp" template function replacement
locals { timestamp = regex_replace(timestamp(), "[- TZ:]", "") }

# Variable - AMI naming
locals {
  image_name = "ballerine-marketplace-snapshot-${local.timestamp}"
}

# Builder - Provision AWS instance
source "amazon-ebs" "ballerine-aws-ami" {
  ami_name   = "ballerine-ami-${local.timestamp}"
  instance_type = "${var.instance_type}"
  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/sda1"
    volume_size           = 25
    volume_type           = "gp2"
  }
  region          = "eu-central-1"
  source_ami      = "${var.base_ami}"
  ssh_username    = "ballerine"
  subnet_id       = "${var.subnet_id}"
  vpc_id          = "${var.vpc_id}"
  skip_create_ami = false
  user_data_file  = "./defaults.cfg"
}

# Provisioning - Setup Ballerine
build {
  sources = ["source.amazon-ebs.ballerine-aws-ami"]

  provisioner "ansible" {
    user = "ballerine"
    playbook_file = "../ansible/ballerine_playbook/ballerine-playbook.yml"
    extra_arguments = ["--skip-tags", "deploy"]
  }
}
