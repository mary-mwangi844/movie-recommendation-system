'use client';
import { useState } from 'react';

const fileStructure = [
  {
    name: 'frontend',
    type: 'folder',
    children: [
      { name: 'src', type: 'folder', children: [] },
      { name: 'public', type: 'folder', children: [] },
      { name: 'package.json', type: 'file' },
      { name: '.env.local', type: 'file' },
    ]
  },
  {
    name: 'backend',
    type: 'folder',
    children: [
      { name: 'src', type: 'folder', children: [] },
      { name: 'prisma', type: 'folder', children: [] },
      { name: 'package.json', type: 'file' },
      { name: '.env', type: 'file' },
    ]
  },
  {
    name: 'docker',
    type: 'folder',
    children: [
      { name: 'docker-compose.yml', type: 'file' },
      { name: 'Dockerfile', type: 'file' },
    ]
  },
  {
    name: 'infrastructure',
    type: 'folder',
    children: [
      { name: 'nginx.conf', type: 'file' },
      { name: 'deploy.sh', type: 'file' },
    ]
  },
  { name: '.env', type: 'file' },
  { name: 'README.md', type: 'file' },
];

function FileTreeNode({ node, level = 0 }: { node: any; level?: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const isFolder = node.type === 'folder';

  if (isFolder) {
    return (
      <div>
        <div
          className="flex items-center gap-1 px-2 py-1 hover:bg-gray-800 rounded cursor-pointer"
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{isOpen ? '📂' : '📁'}</span>
          <span className="text-sm font-medium">{node.name}</span>
        </div>
        {isOpen && node.children && (
          <div>
            {node.children.map((child: any, index: number) => (
              <FileTreeNode key={index} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-2 px-2 py-1 hover:bg-gray-800 rounded cursor-pointer"
      style={{ paddingLeft: `${level * 16 + 24}px` }}
    >
      <span>📄</span>
      <span className="text-sm">{node.name}</span>
    </div>
  );
}

export function FileExplorer() {
  return (
    <div className="h-full overflow-y-auto bg-gray-900">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Explorer</h2>
      </div>
      <div className="p-2 space-y-0.5">
        {fileStructure.map((node, index) => (
          <FileTreeNode key={index} node={node} />
        ))}
      </div>
    </div>
  );
}
