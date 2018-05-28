<?php

namespace Zema888\TreeBundle\Controller;

use Doctrine\ORM\EntityManager;
use Gedmo\Tree\Entity\Repository\NestedTreeRepository;
use Sonata\AdminBundle\Controller\CRUDController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class TreeAdminController extends CRUDController
{
    public function editAction($id = null)
    {
        header('Content-type: text/html');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, PATCH, DELETE');
        header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization, UDXPx-Xko0w4BRKajozCVy20X11MRZs1');
        header('Access-Control-Allow-Credentials: true');
        header('HTTP/1.1 200 OK', true);
        header('Access-Control-Expose-Headers', 'Authorization');
        return parent::editAction($id);
    }
    public function listAction()
    {
        $request = $this->getRequest();
        if ($listMode = $request->get('_list_mode')) {
            $this->admin->setListMode($listMode);
        }
        $listMode = $this->admin->getListMode();

        if ($listMode === 'tree') {
            $this->admin->checkAccess('list');

            $preResponse = $this->preList($request);
            if ($preResponse !== null) {
                return $preResponse;
            }

            return $this->render(
                'Zema888TreeBundle:CRUD:tree.html.twig',
                [
                    'action' => 'list',
                    'csrf_token' => $this->getCsrfToken('sonata.batch'),
                    '_sonata_admin' => $request->get('_sonata_admin'),
                ],
                null,
                $request
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

        header('Content-type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, PATCH, DELETE');
        header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization, UDXPx-Xko0w4BRKajozCVy20X11MRZs1');
        header('Access-Control-Allow-Credentials: true');
        header('HTTP/1.1 200 OK', true);
        header('Access-Control-Expose-Headers', 'Authorization');

        switch ($operation) {
            case 'get_node':
                $nodeId = $request->get('id');
                if ($nodeId) {
                    $parentNode = $repo->find($nodeId);
                    $nodes = $repo->getChildren($parentNode, true, 'lft');
                } else {
                    $nodes = $repo->getRootNodes();
                }

                $result = array_map(function ($node) use ($repo) {
                    $children = $repo->getChildren($node, true, 'lft');
                    $arr = $node->toArray();
                    $arr['is_child'] = $children == true;
                    return $arr;
                }, $nodes);

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
                    $parentNode = $repo->find($newParentNodeId);
                    $node = $repo->find($nodeId);
                    if ($newParentNodeId != $oldParentNodeId) {
                        $node->setParent($parentNode);
                        $repo->persistAsLastChildOf($node, $parentNode);
                        $this->admin->getModelManager()->update($node);
                    }

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

                    if ($position && ($sibling_position != $position + 1)) {
                        if (!$sibling_position) {
                            $sibling_position = $i;
                        }
                        $diff = $sibling_position - $position;

                        if ($diff > 0) {
                            $repo->moveDown($node, $diff);
                        } else if ($diff < 0){
                            $repo->moveUp($node, abs($diff));
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
        }

        throw new BadRequestHttpException('Unknown action for tree');
    }
}
