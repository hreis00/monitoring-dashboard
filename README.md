# Heimdall Dashboard 🚀

A comprehensive monitoring solution using Heimdall as a dashboard interface, integrated with Prometheus, Grafana, Node-Exporter, and Glances for complete system monitoring.

## 📋 Features

- **Heimdall Dashboard**: Central access point for all services
- **Prometheus**: Metrics collection and storage
- **Grafana**: Visualization and analytics
- **Node-Exporter**: Hardware and OS metrics
- **Glances**: System monitoring tool

## 🚀 Quick Start

### Prerequisites

- Docker
- Docker Compose
- Git

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd heimdall
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Update the .env file with your settings:

```bash
# Grafana settings
GF_SECURITY_ADMIN_PASSWORD=your_secure_password
GF_USERS_ALLOW_SIGN_UP=false

# Heimdall settings
PUID=1000
PGID=1000
TZ=UTC
```

4. Start the services:

```bash
docker-compose up -d
```

## 🌐 Access Services

After starting the containers, access the services at:

- **Heimdall**: http://localhost:80
- **Grafana**: http://localhost:3000
- **Prometheus**: http://localhost:9090
- **Node-Exporter**: http://localhost:9100/metrics
- **Glances**: http://localhost:61208

## ⚙️ Configuration

**Grafana Setup**

1. Login to Grafana:
   - URL: http://localhost:3000
   - Default username: `admin`
   - Password: Set in .env
2. Add Prometheus Data Source:
   - URL: `http://prometheus:9090`
   - Access: Browser

**Heimdall Setup**

Add your applications as tiles in the Heimdall dashboard for easy access.

## 📦 Project Structure

```plaintext
|
├── config/                 # Heimdall configuration directory
│   ├── keys/               # SSL/TLS certificates and keys
│   ├── log/                # Application logs
│   ├── nginx/              # Nginx configuration
│   ├── php/                # PHP configuration
│   └── www/                # Web root directory
│
├── prometheus/             # Prometheus configuration directory
│   └── prometheus.yml      # Prometheus scrape configuration
│
├── docker-compose.yml      # Docker services orchestration
├── .env                    # Environment variables (ignored by git)
├── .env.example            # Example environment variables template
├── .editorconfig           # Editor configuration
├── .gitignore              # Git ignore patterns
├── .dockerignore           # Docker ignore patterns
├── LICENSE                 # GPL-3.0 license
└── README.md               # Project documentation

# Volumes (managed by Docker)
├── prometheus_data/     # Prometheus time series data
└── grafana_data/       # Grafana dashboards and settings
```

## 🔧 Maintenance

**Backup**
Important directories to backup:

- ./config (Heimdall configuration)
- Grafana data volume
- Prometheus data volume

**Updates**
To update the services:

```bash
docker-compose pull
docker-compose up -d
```

## 🛠 Troubleshooting

Common issues and solutions:

1. **Port Conflicts**

   - Ensure no other services are using the required ports
   - Modify port mappings in docker-compose.yml if needed

2. **Permission Issues**

   - Check PUID and PGID in .env
   - Verify volume permissions

## 📝 License

Distributed under the GPL-3 License. See [LICENSE](LICENSE) for details.

## 📩 Contact

Hugo Reis - hugo.b.reis@nos.pt
Project link: https://github.com/hreis00/heimdall

[⬆️ Back to top](#heimdall-dashboard-)
