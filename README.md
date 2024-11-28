```
cd Blog/backend
./vendor/bin/sail up -d
```
```
cd Blog/frontend
npm run dev
```
Create database  
`./vendor/bin/sail artisan migrate`  
Seeding data  
`./vendor/bin/sail artisan db:seed`
