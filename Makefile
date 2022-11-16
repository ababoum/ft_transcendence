all:
	docker-compose up --build -d
	docker exec -it postgres sh -c "chmod -R 777 /var/lib/postgresql/data/"

clean:
	docker-compose stop
	docker-compose down

fclean: clean
	-rm -rf /goinfre/$(USER)/data/*
	docker system prune -f
	docker image prune -f
	@-docker rmi -f $(shell docker images -qa | uniq)

test_env:
	docker-compose up -d postgres adminer
	docker exec -it postgres sh -c "chmod -R 777 /var/lib/postgresql/data/"

re: fclean all

.PHONY: all clean fclean re test_env