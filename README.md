# rbms-credit-rating fullstack app
## Setup DB
```bash
  mysql -u root -p -e "source database/schema.sql"
```

## Start Backend
1. cd into Backend folder
```bash
  cd rmbs-be
```
2. Install
```bash
  pip install
```
3. Update the .env file with the username and password for the root user of your MySQL db
4. Start Backend
```bash
  python -m uvicorn main:app --reload --port 8001
```


## Start Frontend
1. cd into Frontend folder
```bash
  cd rmbs-fe
```
2. Install
```bash
  npm install
```
3. Update the backend url in the constants folder if needed
4. Start Frontend
```bash
  npm run dev
```
