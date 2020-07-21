---
title: Setup a Django Project with a MySQL database.
description: This simple tutorial will show you haow to setup Django with a MySQL database.
tags:
  - Django
  - MySQL
  - Python
  - Django Database
categories:
  - Django
date: 2016-03-29 17:50:43
alias: /developer/setup-a-django-project-with-a-mysql-database/
---

This tutorial will show you haow to setup Django with a MySQL database, it requires Python 2.7. 

<!--more-->

First make sure virtualenv is installed: `$ pip install virtualenv` 

To set up a virtual environment for your project, use: `$ virtualenv myproject` 

To join the environment: `$ source myproject/bin/activate` 

Install Django: `$ pip install Django` 

Create a Django project. `$ django-admin startproject mysite` 

By default Django will make use of sqlite3. But for a production site, MySQL would be better. I’m running XAMPP on Mac OS X, which includes MySQL already, so I will make use of this installation. When you don’t have MySQL on your machine, you can make a fresh install. Download the MySQL Community Server from the official site. Select your platform and download the file. For a Mac OS X, you should have a .dmg file. After clicking on it to install MySQL, you will have to double click on the .pkg file to install it. Next, we need to modify the *$PATH* so that the mysql command lines are available in your terminal. Edit the *~/.bash_profile* file and add the following: `export PATH=$PATH:/usr/local/mysql/bin` Then restart your terminal, and start MySQL: `$ sudo /usr/local/mysql/support-files/mysql.server start` (In my case, I just had to start MySQL from the XAMPP quickstart app.) Next, create a username with a password: `$ mysqladmin -u root password yourpassword` If you need to change the root password use: `$ mysqladmin -u root -p'oldpassword' password newpassword` 

Note: there is no space between the -p and the old password. (Since I already have a working user account, and MySQL with PHPMyAdmin running, I could skip this last step) Next, open mysql using the root account, and enter your password. `$ mysql -u root -p` Or if you rather use PhpMyAdmin, login to http://localhost/phpmyadmin And go to the SQL tab. Run the following query, with your database name, and username + password:

``` SQL
CREATE DATABASE mydatabase;
CREATE USER 'username'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON mydatabase.* TO 'username'@'localhost';
FLUSH PRIVILEGES;
```

You can check the grants for a given user with: `show grants for 'username'@'localhost';` Once the database is correctly setup, you can install the Python MySQL adapter, from the command-line: `$ pip install mysqlclient` NOTE: The mysqlclient, will refer to a libmysqlclient.x.dylib file on your local machine. It's important that the folder which contains this file (it comes with your MySQL installation), has been added to the system variables / $PATH variables. Open *mysite/settings.py*, edit the databases block:

``` Python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'mydatabase',
        'USER': 'username',
        'PASSWORD': 'your_password',
        'HOST': '',
        'PORT': '',
    }
}
```

Also, make sure the timezone is correctly setup: `TIME_ZONE = 'CET'` Save the file, and run the following commands from the command-line, to use the database in your Python project: `$ python manage.py check` `$ python manage.py migrate` Now you have to create a superuser for your project: `$ python manage.py createsuperuser` Let’s finish our application, and add the administration back-end. Open *mysite/urls.py* and make sure the following lines are present:


``` Python
from django.conf.urls import url
from django.contrib import admin

urlpatterns = [
    url(r'^admin/', admin.site.urls),
]
```

You can start with running the python server, from the mysite folder: `$ python manage.py runserver` You can test and see if MySQL is correctly working, by logging into the Django admin panel. You could create a new user, this one should be available in the MySQL **auth_user** table. From here, you can make changes to the database tables and properties, so be careful because they will interfere with the structure defined in your Django models. Good luck!