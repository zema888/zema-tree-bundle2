<?php
namespace ZemaTreeBundle\Transformer;


use ZemaTreeBundle\Interfaces\NodeInterface;

class NodeTransformer
{
    /**
     * @param NodeInterface $node
     * @return array
     */
    public static function fromObjectToArray(NodeInterface $node): array
    {
        return [
            'id' => $node->getId(),
            'title' => $node->getMenutitle(),
            'lft' => $node->getLft(),
            'lvl' => $node->getLvl(),
            'path' => $node->getPath(),
            'module' => $node->getModuleTitle(),
            'parentId' => $node->getParentId(),
            'hasChildren' => $node->hasChildren(),
            'active' => $node->getActive(),
        ];
    }

    /**
     * @param NodeInterface[] $nodes
     * @return array
     */
    public static function fromCollectionToArray($nodes): array
    {
        $res = [];
        foreach ($nodes as $node) {
            $res[] = self::fromObjectToArray($node);
        }
        return $res;
    }
}