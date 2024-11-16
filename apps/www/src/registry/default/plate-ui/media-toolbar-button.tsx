'use client';

import React, { useCallback, useEffect, useState } from 'react';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

import { cn } from '@udecode/cn';
import { useEditorRef } from '@udecode/plate-core/react';
import {
  AudioPlugin,
  FilePlugin,
  ImagePlugin,
  VideoPlugin,
} from '@udecode/plate-media/react';
import { insertNodes } from '@udecode/slate';
import { focusEditor } from '@udecode/slate-react';
import {
  AudioLinesIcon,
  FileUpIcon,
  FilmIcon,
  ImageIcon,
  LinkIcon,
} from 'lucide-react';
import { useFilePicker } from 'use-file-picker';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  useOpenState,
} from './dropdown-menu';
import { Input } from './input';
import {
  ToolbarSplitButton,
  ToolbarSplitButtonPrimary,
  ToolbarSplitButtonSecondary,
} from './toolbar';
const MEDIA_CONFIG: Record<
  string,
  {
    accept: string[];
    icon: React.ReactNode;
    placeholder: string;
    title: string;
    tooltip: string;
  }
> = {
  [AudioPlugin.key]: {
    accept: ['audio/*'],
    icon: <AudioLinesIcon className="size-4" />,
    placeholder: 'https://example.com/audio.mp3',
    title: 'Insert Audio',
    tooltip: 'Audio',
  },
  [FilePlugin.key]: {
    accept: ['*'],
    icon: <FileUpIcon className="size-4" />,
    placeholder: 'https://example.com/file.pdf',
    title: 'Insert File',
    tooltip: 'File',
  },
  [ImagePlugin.key]: {
    accept: ['image/*'],
    icon: <ImageIcon className="size-4" />,
    placeholder: 'https://example.com/image.jpg',
    title: 'Insert Image',
    tooltip: 'Image',
  },
  [VideoPlugin.key]: {
    accept: ['video/*'],
    icon: <FilmIcon className="size-4" />,
    placeholder: 'https://example.com/video.mp4',
    title: 'Insert Video',
    tooltip: 'Video',
  },
};

export function MediaToolbarButton({
  children,
  nodeType,
  ...props
}: DropdownMenuProps & { nodeType: string }) {
  const currentConfig = MEDIA_CONFIG[nodeType];

  const editor = useEditorRef();
  const openState = useOpenState();

  const { openFilePicker } = useFilePicker({
    accept: currentConfig.accept,
    multiple: true,
    onFilesSelected: ({ plainFiles: updatedFiles }) => {
      (editor as any).tf.insert.media(updatedFiles);
    },
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  const [url, setUrl] = useState('');

  const embedMedia = useCallback(() => {
    setDialogOpen(false);
    insertNodes(editor, {
      children: [{ text: '' }],
      name: nodeType === FilePlugin.key ? url.split('/').pop() : undefined,
      type: nodeType,
      url,
    });
  }, [editor, nodeType, url]);

  useEffect(() => {
    if (!dialogOpen) {
      focusEditor(editor);
      setUrl('');
    }
  }, [dialogOpen, editor]);

  return (
    <>
      <DropdownMenu {...openState} modal={false} {...props}>
        <ToolbarSplitButton pressed={openState.open}>
          <ToolbarSplitButtonPrimary
            onClick={() => openFilePicker()}
            onMouseDown={(e) => e.preventDefault()}
            tooltip={currentConfig.tooltip}
          >
            {currentConfig.icon}
          </ToolbarSplitButtonPrimary>

          <DropdownMenuTrigger asChild>
            <ToolbarSplitButtonSecondary />
          </DropdownMenuTrigger>
        </ToolbarSplitButton>

        <DropdownMenuContent
          className={cn('min-w-0 data-[state=closed]:hidden')}
          align="start"
        >
          <DropdownMenuRadioGroup>
            <DropdownMenuRadioItem
              value="upload"
              onSelect={() => openFilePicker()}
              hideIcon
            >
              <div className="flex items-center gap-2">
                {currentConfig.icon}
                <span className="text-sm">Upload from computer</span>
              </div>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              value="url"
              onSelect={() => setDialogOpen(true)}
              hideIcon
            >
              <div className="flex items-center gap-2">
                <LinkIcon />
                <span className="text-sm">Insert via URL</span>
              </div>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{currentConfig.title}</AlertDialogTitle>
            <AlertDialogDescription className="flex items-center gap-2">
              {currentConfig.icon}
              <Input
                variant="underline"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') embedMedia();
                }}
                placeholder={currentConfig.placeholder}
                h="sm"
                autoFocus
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>CANCEL</AlertDialogCancel>
            <AlertDialogAction onClick={embedMedia}>
              {currentConfig.title.toUpperCase()}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
