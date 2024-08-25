
start: 
	cd srcs && docker-compose up

re: clean build up

mkdir:
	mkdir ~/data ~/data/db ~/data/wp
build:
	cd srcs && docker-compose build --no-cache
up:
	cd srcs && docker-compose up -d
down:
	cd srcs && docker-compose down -v
clean: down
	@echo "Cleaning up Docker resources..."

	@if [ ! -z "$$(docker ps -qa)" ]; then \
		docker stop $$(docker ps -qa) || true; \
		docker rm $$(docker ps -qa) || true; \
	else \
		echo "No containers to stop or remove."; \
	fi

	@if [ ! -z "$$(docker images -qa)" ]; then \
		docker rmi -f $$(docker images -qa) || true; \
	else \
		echo "No images to remove."; \
	fi


	@if [ ! -z "$$(docker network ls -q)" ]; then \
		docker network rm $$(docker network ls -q) || true; \
	else \
		echo "No networks to remove."; \
	fi