<?php

namespace ZemaTreeBundle\Admin;

use Sonata\AdminBundle\Admin\AbstractAdmin;

class AbstractTreeAdmin extends AbstractAdmin
{
    /**
     * @var string
     */
    private $treeTextField;

    public function __construct($code, $class, $baseControllerName, $treeTextField)
    {
        parent::__construct($code, $class, $baseControllerName);
        $this->listModes['tree'] = [
            'class' => 'fa fa-tree fa-fw',
        ];

        $this->listModes['list'] = [
            'class' => 'fa fa-list fa-fw',
        ];
        if (empty($treeTextField)) {
            throw new \UnexpectedValueException('It\'s required to specify \'treeTextField\' for tree view');
        }
        $this->treeTextField = $treeTextField;
    }

    /**
     * @return string
     */
    public function getTreeTextField()
    {
        return $this->treeTextField;
    }
}
