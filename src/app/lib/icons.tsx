/**
 * Icon shim: re-exports Material UI "Rounded" (filled) icons under the
 * lucide-react names used across the app, so existing call sites keep working.
 *
 * Lucide-style props are translated:
 *   - `size` -> CSS fontSize (lucide default 24)
 *   - `color` -> CSS color (fill uses currentColor)
 *   - `strokeWidth` -> ignored (filled icons have no stroke)
 * `className`, `style`, `sx` and any other SvgIcon props pass through.
 */
import * as React from 'react';
import type { SvgIconProps } from '@mui/material/SvgIcon';

// MUI Rounded (filled) source icons
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import MenuBookRounded from '@mui/icons-material/MenuBookRounded';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import CheckRounded from '@mui/icons-material/CheckRounded';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowLeftRounded from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRounded from '@mui/icons-material/KeyboardArrowRightRounded';
import KeyboardArrowUpRounded from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardDoubleArrowLeftRounded from '@mui/icons-material/KeyboardDoubleArrowLeftRounded';
import CircleRounded from '@mui/icons-material/CircleRounded';
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded';
import DownloadRounded from '@mui/icons-material/DownloadRounded';
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded';
import ImageRounded from '@mui/icons-material/ImageRounded';
import DataObjectRounded from '@mui/icons-material/DataObjectRounded';
import DescriptionRounded from '@mui/icons-material/DescriptionRounded';
import GridViewRounded from '@mui/icons-material/GridViewRounded';
import DragIndicatorRounded from '@mui/icons-material/DragIndicatorRounded';
import HomeRounded from '@mui/icons-material/HomeRounded';
import AddPhotoAlternateRounded from '@mui/icons-material/AddPhotoAlternateRounded';
import LinkRounded from '@mui/icons-material/LinkRounded';
import RemoveRounded from '@mui/icons-material/RemoveRounded';
import MoreHorizRounded from '@mui/icons-material/MoreHorizRounded';
import PaletteRounded from '@mui/icons-material/PaletteRounded';
import ViewSidebarRounded from '@mui/icons-material/ViewSidebarRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import ColorizeRounded from '@mui/icons-material/ColorizeRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import AddRounded from '@mui/icons-material/AddRounded';
import RedoRounded from '@mui/icons-material/RedoRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import AutoAwesomeRounded from '@mui/icons-material/AutoAwesomeRounded';
import StickyNote2Rounded from '@mui/icons-material/StickyNote2Rounded';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import TextFieldsRounded from '@mui/icons-material/TextFieldsRounded';
import UndoRounded from '@mui/icons-material/UndoRounded';
import UploadRounded from '@mui/icons-material/UploadRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import ZoomInRounded from '@mui/icons-material/ZoomInRounded';
import ZoomOutRounded from '@mui/icons-material/ZoomOutRounded';

type LucideProps = Omit<SvgIconProps, 'color'> & {
  size?: number | string;
  strokeWidth?: number | string;
  color?: string;
  absoluteStrokeWidth?: boolean;
};

type MuiIcon = React.ComponentType<SvgIconProps>;

function wrap(Icon: MuiIcon, displayName: string) {
  const Wrapped = React.forwardRef<SVGSVGElement, LucideProps>(
    (
      { size, strokeWidth, absoluteStrokeWidth, color, style, sx, ...rest }: LucideProps,
      ref: React.Ref<SVGSVGElement>,
    ) => {
      const mergedSx = {
        ...(size != null ? { fontSize: size } : null),
        ...(color != null ? { color } : null),
        ...(sx as object),
      };
      return <Icon ref={ref} sx={mergedSx} style={style} {...rest} />;
    },
  );
  Wrapped.displayName = displayName;
  return Wrapped;
}

export const ArrowLeft = wrap(ArrowBackRounded, 'ArrowLeft');
export const ArrowRight = wrap(ArrowForwardRounded, 'ArrowRight');
export const BookOpen = wrap(MenuBookRounded, 'BookOpen');
export const CheckCircle2 = wrap(CheckCircleRounded, 'CheckCircle2');
export const CheckIcon = wrap(CheckRounded, 'CheckIcon');
export const Check = wrap(CheckRounded, 'Check');
export const ChevronDown = wrap(KeyboardArrowDownRounded, 'ChevronDown');
export const ChevronDownIcon = wrap(KeyboardArrowDownRounded, 'ChevronDownIcon');
export const ChevronLeft = wrap(KeyboardArrowLeftRounded, 'ChevronLeft');
export const ChevronLeftIcon = wrap(KeyboardArrowLeftRounded, 'ChevronLeftIcon');
export const ChevronRight = wrap(KeyboardArrowRightRounded, 'ChevronRight');
export const ChevronRightIcon = wrap(KeyboardArrowRightRounded, 'ChevronRightIcon');
export const ChevronUp = wrap(KeyboardArrowUpRounded, 'ChevronUp');
export const ChevronUpIcon = wrap(KeyboardArrowUpRounded, 'ChevronUpIcon');
export const ChevronsLeft = wrap(KeyboardDoubleArrowLeftRounded, 'ChevronsLeft');
export const Circle = wrap(CircleRounded, 'Circle');
export const CircleIcon = wrap(CircleRounded, 'CircleIcon');
export const Copy = wrap(ContentCopyRounded, 'Copy');
export const Download = wrap(DownloadRounded, 'Download');
export const ExternalLink = wrap(OpenInNewRounded, 'ExternalLink');
export const FileImage = wrap(ImageRounded, 'FileImage');
export const FileJson = wrap(DataObjectRounded, 'FileJson');
export const FileText = wrap(DescriptionRounded, 'FileText');
export const Grid = wrap(GridViewRounded, 'Grid');
export const GripVertical = wrap(DragIndicatorRounded, 'GripVertical');
export const GripVerticalIcon = wrap(DragIndicatorRounded, 'GripVerticalIcon');
export const Home = wrap(HomeRounded, 'Home');
export const Image = wrap(ImageRounded, 'Image');
export const ImagePlus = wrap(AddPhotoAlternateRounded, 'ImagePlus');
export const Link = wrap(LinkRounded, 'Link');
export const Link2 = wrap(LinkRounded, 'Link2');
export const MinusIcon = wrap(RemoveRounded, 'MinusIcon');
export const MoreHorizontal = wrap(MoreHorizRounded, 'MoreHorizontal');
export const MoreHorizontalIcon = wrap(MoreHorizRounded, 'MoreHorizontalIcon');
export const Palette = wrap(PaletteRounded, 'Palette');
export const PanelLeftIcon = wrap(ViewSidebarRounded, 'PanelLeftIcon');
export const Pencil = wrap(EditRounded, 'Pencil');
export const Pipette = wrap(ColorizeRounded, 'Pipette');
export const Play = wrap(PlayArrowRounded, 'Play');
export const Plus = wrap(AddRounded, 'Plus');
export const Redo2 = wrap(RedoRounded, 'Redo2');
export const SearchIcon = wrap(SearchRounded, 'SearchIcon');
export const Sparkles = wrap(AutoAwesomeRounded, 'Sparkles');
export const StickyNote = wrap(StickyNote2Rounded, 'StickyNote');
export const Trash2 = wrap(DeleteRounded, 'Trash2');
export const Type = wrap(TextFieldsRounded, 'Type');
export const Undo2 = wrap(UndoRounded, 'Undo2');
export const Upload = wrap(UploadRounded, 'Upload');
export const X = wrap(CloseRounded, 'X');
export const XIcon = wrap(CloseRounded, 'XIcon');
export const ZoomIn = wrap(ZoomInRounded, 'ZoomIn');
export const ZoomOut = wrap(ZoomOutRounded, 'ZoomOut');
