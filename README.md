# sonata-admin-tree-bundle
This bundle integrates [jsTree](https://www.jstree.com/) and [Gedmo Nested Set](https://github.com/stof/StofDoctrineExtensionsBundle) directly to [Sonata Admin](https://sonata-project.org/).

A tree builds itself in an asynchronous way. Hence, it's quite good for big trees.

## Installation

### Install requirements

**SonataAdminBundle**  
\- the SonataAdminBundle provides an installation article here:  
http://symfony.com/doc/current/bundles/SonataAdminBundle/index.html

**StofDoctrineExtensionsBundle**  
\- then you need to install StofDoctrineExtensionsBundle  
https://symfony.com/doc/master/bundles/StofDoctrineExtensionsBundle/index.html

**Enable Tree Extension**  
\- nested behaviour will implement the standard Nested-Set behaviour on your Entity  
https://github.com/Atlantic18/DoctrineExtensions/blob/master/doc/tree.md

### Install TreeBundle

Install it via composer 
```bash
composer require Zema888/tree-bundle
```

Register the bundle in your app kernel `./app/AppKernel.php`
```php
class AppKernel extends Kernel
{
    public function registerBundles()
    {
        $bundles = array(
            ...
            new Zema888\TreeBundle\Zema888TreeBundle(),
        );
        ...
    }
}
```

Add the following lines to the routing file `./app/config/routing.yml`
```yml
Zema888_tree:
    resource: "@Zema888TreeBundle/Resources/config/routing.yml"
    prefix:   /admin
```


For the entity with enabled [Gedmo Nested Set](https://github.com/Atlantic18/DoctrineExtensions/blob/master/doc/tree.md) follow these steps:

Extend Admin class from `\Zema888\TreeBundle\Admin\AbstractTreeAdmin`
```php
class SubjectAdmin extends AbstractTreeAdmin
{
...
}
```

Extend AdminController from `\Zema888\TreeBundle\Controller\TreeAdminController`
```php
class SubjectAdminController extends TreeAdminController
{
...
}
```

When registering the admin as a service, you need to provide a fourth argument - the name of the field that will be shown in the tree. 
```yml
app.admin.subject:
    class: AppBundle\Admin\SubjectAdmin
    arguments: [~, AppBundle\Entity\Subject, AppBundle:SubjectAdmin, 'word']
    tags:
        - {name: sonata.admin, manager_type: orm, group: Search, label: Subject}
```

## How it looks like

![Zema888/tree-bundle](http://g.recordit.co/QwdbrR3P9R.gif)
