NAME = ping_me_more
IMG_TO_DEL = $(shell docker images -q | wc -l)

all: $(NAME)

$(NAME):
	# source db_folder_namer.sh
	docker-compose up --build -d
	docker exec -it postgres sh -c "chmod -R 777 /var/lib/postgresql/data/"


clean:
	docker-compose stop
	docker-compose down

fclean: clean
	-rm -rf /goinfre/$(USER)/data/*
	docker system prune -f
	docker image prune -f
ifneq (${IMG_TO_DEL}, 0)
	$(shell docker rmi -f $(docker images -q))
endif


# update_scheme:
# 	docker-compose up postgres -d
# 	cd backend/
# 	npx prisma migrate dev --name NAME

re: fclean all

.PHONY: linux all clean fclean re