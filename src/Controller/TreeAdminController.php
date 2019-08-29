<?php

namespace ZemaTreeBundle\Controller;

use Doctrine\ORM\EntityManager;
use Gedmo\Tree\Entity\Repository\NestedTreeRepository;
use ZemaTreeBundle\Response\ErrorResponse;
use Sonata\AdminBundle\Controller\CRUDController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use ZemaTreeBundle\Transformer\NodeTransformer;

class TreeAdminController extends CRUDController
{
    public function editAction($id = null)
    {
        return parent::editAction($id);
    }
    public function listAction()
    {
        $request = $this->getRequest();
        if ($listMode = $request->get('_list_mode')) {
            $this->admin->setListMode($listMode);
        }
        $listMode = $this->admin->getListMode();

        $doctrine = $this->get('doctrine');
        /** @var EntityManager $em */
        $em = $doctrine->getManagerForClass($this->admin->getClass());
        /** @var NestedTreeRepository $repo */
        $repo = $em->getRepository($this->admin->getClass());
        $rootNodes = $repo->getRootNodes('id');
        $rootNode = $rootNodes ? $rootNodes[0]->getId() : 1;

        if ($listMode === 'tree') {
            $this->admin->checkAccess('list');

            $preResponse = $this->preList($request);
            if ($preResponse !== null) {
                return $preResponse;
            }

            return $this->renderWithExtraParams(
                'ZemaTreeBundle:CRUD:tree.html.twig',
                [
                    'action' => 'list',
                    'csrf_token' => $this->getCsrfToken('sonata.batch'),
                    '_sonata_admin' => $request->get('_sonata_admin'),
                    'rootNode' => $rootNode,
                ]
            );
        }

        return parent::listAction();
    }

    public function treeDataAction()
    {
        $request = $this->getRequest();
        
        $doctrine = $this->get('doctrine');
        /** @var EntityManager $em */
        $em = $doctrine->getManagerForClass($this->admin->getClass());
        /** @var NestedTreeRepository $repo */
        $repo = $em->getRepository($this->admin->getClass());

        $operation = $request->get('operation');

        switch ($operation) {
            case 'get_one_node':
                $nodeId = $request->get('id');
                if ($nodeId) {
                    $node = $repo->find($nodeId);
                    if ($node) {
                        return new JsonResponse(NodeTransformer::fromObjectToArray($node));
                    }
                }
                return new JsonResponse(ErrorResponse::getError('node_not_found'));

            case 'get_nodes':
                $nodeId = $request->get('id');
                if ($nodeId) {
                    $parentNode = $repo->find($nodeId);
                    if ($parentNode) {
                        $nodes = $repo->getChildren($parentNode, true, 'lft');
                        return new JsonResponse(NodeTransformer::fromCollectionToArray($nodes));
                    }
                }

                return new JsonResponse(ErrorResponse::getError('node_not_found'));

                return new JsonResponse($result);
            case 'move_node':
                try {
                    $json = $request->getContent();
                    if ($json) {
                        $request_data = json_decode($request->getContent(), true);
                    }

                    $nodeId = (int)$request_data['id'];
                    $newParentNodeId = (int)$request_data['target'];
                    $oldParentNodeId = (int)$request_data['source'];
                    $sibling_id = (int)$request_data['sibling'];
                    $type = $request_data['type'];
                    $parentNode = $repo->find($newParentNodeId);
                    $node = $repo->find($nodeId);
                    if ($newParentNodeId != $oldParentNodeId) {
                        $node->setParent($parentNode);
                        $repo->persistAsLastChildOf($node, $parentNode);
                        $this->admin->getModelManager()->update($node);
                    }
                    if ($sibling_id) {
                        $siblings = $repo->getChildren($parentNode, false, 'lft');
                        $position = 0;
                        $sibling_position = 0;
                        $i = 0;
                        foreach ($siblings as $sibling) {
                            $i++;
                            if ($sibling->getId() == $node->getId()) {
                                $position = $i;
                            }
                            if ($sibling->getId() == $sibling_id) {
                                $sibling_position = $i;
                            }
                        }

                        if ($position) {
                            if (!$sibling_position) {
                                $sibling_position = $i;
                            }
                            $diff = $sibling_position - $position;
                            if ($diff > 0) {
                                if ($type == 'before') {
                                    $diff--;
                                }
                                if ($diff != 0) {
                                    $repo->moveDown($node, $diff);
                                }
                            } else {
                                if ($type == 'after') {
                                    $diff++;
                                }
                                if ($diff != 0) {
                                    $repo->moveUp($node, abs($diff));
                                }
                            }
                        }
                    }
                } catch (\Exception $e) {
                    return new JsonResponse(['error' => $e->getMessage()]);
                }
                return new JsonResponse(['ok' => true]);
            case 'delete_node':
                $nodeId = $request->get('id');
                $node = $repo->find($nodeId);
                $this->admin->getModelManager()->delete($node);

                return new JsonResponse(['ok' => true]);
            case 'toogle_active':
                $nodeId = $request->get('id');
                $node = $repo->find($nodeId);
                $node->setActive(!$node->getActive());
                $em->persist($node);
                $em->flush();
                return new JsonResponse(['ok' => true]);
            case 'search':
                // TODO проверка есть ли метод и исходя из этого поиск показывать или нет
                $query = $request->get('query');
                $nodes = $repo->searchTreePages($query);
                return new JsonResponse(NodeTransformer::fromCollectionToArray($nodes));
        }

        throw new BadRequestHttpException('Unknown action for tree');
    }

}
