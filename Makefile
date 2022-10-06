NAME = ping_me_more

all: $(NAME)

$(NAME): 
	mkdir -p "./data1"
	docker-compose up --build -d
	docker exec -it postgres chmod 777 /var/lib/postgresql/data/

clean:
	docker-compose stop
	docker-compose down

fclean: clean
	rm -rf /goinfre/$(USER)/data1/
	docker system prune -f
	docker image prune -f --filter 'label=ping_me_more'

# update_scheme:
# 	docker-compose up postgres -d
# 	cd backend/
# 	npx prisma migrate dev --name NAME

re: fclean all

.PHONY: linux all clean fclean re