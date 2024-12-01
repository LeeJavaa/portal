"""Gunicorn production configuration file"""
import multiprocessing

wsgi_app = "backend.wsgi:application"

# Set environment variables
raw_env = [
    "DJANGO_SETTINGS_MODULE=backend.settings_prod"
]

workers = multiprocessing.cpu_count() * 2 + 1  # (2 x NUMBER_OF_CPU_CORES) + 1
worker_class = "sync"

bind = "127.0.0.1:8000"  # Only allow internal connections, Nginx will proxy

timeout = 300  # 5 minutes for long-running tasks
keepalive = 65
graceful_timeout = 30  # How long to wait before forcefully killing workers

loglevel = "info"
accesslog = "/var/log/gunicorn/access.log"
errorlog = "/var/log/gunicorn/error.log"
capture_output = True

pidfile = "/var/run/gunicorn/prod.pid"

daemon = False

# SSL (if not terminating SSL at nginx)
# keyfile = "/etc/ssl/private/your-ssl.key"
# certfile = "/etc/ssl/certs/your-ssl.crt"

proc_name = "portal_gunicorn"

max_requests = 1000
max_requests_jitter = 50

def post_fork(server, worker):
    server.log.info("Worker spawned (pid: %s)", worker.pid)

def worker_exit(server, worker):
    server.log.info("Worker exited (pid: %s)", worker.pid)

preload_app = True

