NAME = ping_me_more

all: $(NAME)

$(NAME): 
	mkdir -p "./data"
	docker-compose up --build -d
	docker exec -it postgres chmod 777 /var/lib/postgresql/data/

clean:
	docker-compose stop
	docker-compose down

fclean: clean
	# rm -rf /goinfre/$(USER)/data/
	docker system prune -f --all --volumes
	docker system prune -f
	docker image prune -f --filter 'label=ping_me_more'


re: fclean all

.PHONY: linux all clean fclean re