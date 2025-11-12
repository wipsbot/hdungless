/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import {
  ArrowDown,
  ArrowRight,
  Baseline,
  ChevronDown,
  Combine,
  Download,
  Film,
  Folder,
  Image,
  Info,
  KeyRound,
  Layers,
  MessageCircle,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Scissors,
  SlidersHorizontal,
  Sparkles,
  Terminal,
  Trash2,
  Tv,
  Users,
  Video,
  X,
  Zap,
} from 'lucide-react';

const defaultProps = {
  strokeWidth: 1.5,
};

export const KeyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <KeyRound {...defaultProps} {...props} />
);

export const ArrowPathIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <RefreshCw {...defaultProps} {...props} />;

export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Sparkles {...defaultProps} {...props} />
);

export const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Plus {...defaultProps} {...props} />
);

export const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <ChevronDown {...defaultProps} {...props} />;

export const SlidersHorizontalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <SlidersHorizontal {...defaultProps} {...props} />;

export const ArrowRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <ArrowRight {...defaultProps} {...props} />;

export const RectangleStackIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <Layers {...defaultProps} {...props} />;

export const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <X {...defaultProps} {...props} />
);

export const TextModeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Baseline {...defaultProps} {...props} />
);

export const FramesModeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <Image {...defaultProps} {...props} />;

export const ReferencesModeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <Film {...defaultProps} {...props} />;

export const TvIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Tv {...defaultProps} {...props} />
);

export const FilmIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Film {...defaultProps} {...props} />
);

// This icon had a different stroke width in the original file, so we preserve it.
export const CurvedArrowDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <ArrowDown {...props} strokeWidth={3} />;

// New icons for the redesign
export const ZapIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Zap {...defaultProps} {...props} />
);
export const InfoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Info {...defaultProps} {...props} />
);
export const VideoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Video {...defaultProps} {...props} />
);
export const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Download {...defaultProps} {...props} />
);
export const Trash2Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Trash2 {...defaultProps} {...props} />
);
export const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Pencil {...defaultProps} {...props} />
);
export const TerminalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Terminal {...defaultProps} {...props} />
);

// Icons for new UI
export const FolderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Folder {...defaultProps} {...props}/>
);
export const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Users {...defaultProps} {...props}/>
);
export const CombineIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Combine {...defaultProps} {...props}/>
);
export const ScissorsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Scissors {...defaultProps} {...props}/>
);
export const MessageCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <MessageCircle {...defaultProps} {...props}/>
);
export const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Play {...defaultProps} {...props}/>
);


export {Image, Layers, X};