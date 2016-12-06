# khoapham-tick-talk

1/ chuyển con trỏ thư mục hiện hành đến thư mục root của project
cd some-paths/khoapham-tick-talk

2/ Thực hiện cài cái dependences cần thiết 
npm install

3/ Project dùng NoSQL Rethink để lưu dữ liệu người dùng, thực hiện cài đặt một RethinkDB Server 
vào đường dẫn sau để tải và cài đặt đúng môi trường https://www.rethinkdb.com/docs/install/

4/ Khởi động server DB bằng cách ở thư mục root của project exec một trong 2 commands sau:
npm run db 
*hoặc*
rethinkdb
* đợi cho đến khi server db khởi động xong *

5/ Tiến hành chạy HTTP Server với command
npm run start

-> web app được serve ở port 8081 / web app database dashboard ở port 8080
