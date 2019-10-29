# zema888/tree-bundle
This bundle is for convenient administration of the Gedmo Nested Set table.

## Installation

### Install requirements

**SonataAdminBundle**  
\- the SonataAdminBundle provides an installation article here:  
http://symfony.com/doc/current/bundles/SonataAdminBundle/index.html

**StofDoctrineExtensionsBundle**  
\- then you need install StofDoctrineExtensionsBundle  
https://symfony.com/doc/master/bundles/StofDoctrineExtensionsBundle/index.html

**Enable Tree Extension**  
\- nested behavior will implement the standard Nested-Set behavior on your Entity  
https://github.com/Atlantic18/DoctrineExtensions/blob/master/doc/tree.md

### Install TreeBundle

Install it via composer 
```bash
composer require zema888/zema-tree-bundle2
```

Register bundle in kernel `./app/AppKernel.php`
```php
class AppKernel extends Kernel
{
    public function registerBundles()
    {
        $bundles = array(
            ...
            new Zema\TreeBundle\ZemaTreeBundle(),
        );
        ...
    }
}
```

Add following lines to the routing file `./app/config/routing.yml`
```yml
redcode_tree:
    resource: "@ZemaTreeBundle/Resources/config/routing.yml"
    prefix:   /admin
```


For the entity with enabled [Gedmo Nested Set](https://github.com/Atlantic18/DoctrineExtensions/blob/master/doc/tree.md) do following steps:

Extend Admin class from `\Zema\TreeBundle\Admin\AbstractTreeAdmin`
```php
class SubjectAdmin extends AbstractTreeAdmin
{
...
}
```

Extend AdminController from `\Zema\TreeBundle\Controller\TreeAdminController`
```php
class SubjectAdminController extends TreeAdminController
{
...
}
```

When registering admin as a service, provider fourth argument - name of the field that will be shown in the tree. 
```yml
app.admin.subject:
    class: AppBundle\Admin\SubjectAdmin
    arguments: [~, AppBundle\Entity\Subject, AppBundle:SubjectAdmin, 'word']
    tags:
        - {name: sonata.admin, manager_type: orm, group: Search, label: Subject}
```


необходимо
1) в классе куда подключать
public function hasChildren()
2) в репозитории метод для поиска
searchTreePages
3) в config/bundles.php
4) в composer.json
    "autoload": {
        "psr-4": {
            "ZemaTreeBundle\\": "bundles/zema888/ZemaTreeBundle/",
        }
    },
5) в   Admin/TreePagesAdmin.php
use ZemaTreeBundle\Admin\AbstractTreeAdmin;
6) Controller/Admin/PagesAdminController.php
use ZemaTreeBundle\Controller\TreeAdminController;
7) config/routes.yaml
zema_tree:
    resource: "@ZemaTreeBundle/Resources/config/routing.yml"
    prefix:   /admin
8) composer dump-autoload
9) php bin/console assets:install
10) php bin/console cache:clear
11) config/packages/sonata_admin.yaml
sonata_admin:
    options:
        use_bootlint:    true