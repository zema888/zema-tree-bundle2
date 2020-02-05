<?php
namespace ZemaTreeBundle\Interfaces;


interface NodeInterface
{
    /**
     * Unique identificator
     *
     * @return integer
     */
    public function getId();

    /**
     * Short name
     *
     * @return string
     */
    public function getMenutitle();

    /**
     * TreeLeft
     *
     * @return integer
     */
    public function getLft();

    /**
     * TreeLevel
     *
     * @return integer
     */
    public function getLvl();

    /**
     * URL page on the site
     *
     * @return string
     */
    public function getPath();

    /**
     * Type of page
     *
     * @return string
     */
    public function getModuleTitle();

    /**
     * TreeParent
     *
     * @return integer
     */
    public function getParentId();

    /**
     * has child nodes
     *
     * @return bool
     */
    public function hasChildren();

    /**
     * is published
     *
     * @return bool
     */
    public function getActive();
}