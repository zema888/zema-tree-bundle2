<?php
namespace ZemaTreeBundle\Transformer;

// TODO передавать трансформер в бандл
class NodeTransformer
{
    public static function fromObjectToArray($node): array
    {
        return [
            'id' => $node->getId(),
            'title' => $node->getMenutitle(),
            'lft' => $node->getLft(),
            'lvl' => $node->getLvl(),
            'path' => $node->getPath(),
            'module' => $node->getModule()->getTitle(),
            'parentId' => $node->getParentId(),
            'hasChildren' => $node->hasChildren(),
            'active' => $node->getActive(),
        ];
    }

    public static function fromCollectionToArray($nodes): array
    {
        $res = [];
        foreach ($nodes as $node) {
            $res[] = self::fromObjectToArray($node);
        }
        return $res;
    }
}