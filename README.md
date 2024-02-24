# CarpoolBGU

### Client:

To install the npm packages run:\
```npm ci```

### Server:

To install the pip packages run:\
```pip install -r requirements.txt```

### Additional notes:

* For development, use your local MySQL database at the address ```root:[your password]@localhost:3306/CarpoolBGU```.
  you need to create the schema ```CarpoolBGU``` yourself, I personally
  recommend [MySQL Workbench](https://dev.mysql.com/downloads/workbench/).
* Notice that your localhost database password needs to be entered in these files before running:
    * ```/Server/config/dev.py```
    * ```/Server/config/prod.py```
    * ```/Server/config/test.py```
* In order for the client side to run on your local server, you need to install the [Moesif Origin & CORS Changer
  ](https://chromewebstore.google.com/detail/moesif-origin-cors-change/digfbfaphojjndkpccljibejjbppifbc) Chrome
  extension, some requests will be rejected by the server otherwise.
