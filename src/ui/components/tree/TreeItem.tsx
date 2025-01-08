import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import React, { useMemo } from 'react';
import { ITreeData } from './Tree';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export interface ITreeItemProps {
  height?: number;
  enableActivated?: (id: string | number) => boolean;
  onClick?: (opts: {
    event: React.MouseEvent<HTMLDivElement, MouseEvent>;
    id: string | number;
  }) => void;
}

interface IProps<T extends ITreeData> extends ITreeItemProps {
  data: T;
  level: number;
}

export function TreeItem<T extends ITreeData>(props: IProps<T>) {
  const { data, level, ...restProps } = props;
  const { height = 24, enableActivated, onClick } = restProps;

  //--------------------------------------------------
  const [isOpen, setIsOpen] = React.useState(false);

  //--------------------------------------------------
  const hasChild = React.useMemo(() => {
    return (data?.children && data.children.length > 0) ?? false;
  }, [data.children]);

  //--------------------------------------------------
  const isActivated = React.useMemo(() => {
    return enableActivated?.(data.id);
  }, [data.id, enableActivated]);

  //--------------------------------------------------
  const RenderIcon = useMemo(() => {
    if (!hasChild) {
      return data?.icon?.default ?? React.Fragment;
    }

    return isOpen
      ? (data?.icon?.expanded ?? KeyboardArrowDownIcon)
      : (data?.icon?.collapsed ?? KeyboardArrowRightIcon);
  }, [data?.icon, hasChild, isOpen]);

  //--------------------------------------------------
  const handleClick = React.useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return (
    <List disablePadding dense sx={{ overflowX: 'hidden', width: 1 }}>
      <ListItem
        dense
        disableGutters
        disablePadding
        sx={{ height, pl: level > 1 ? (level - 1) * 3 + 3 : 1 }}
      >
        <ListItemButton
          dense
          disableGutters
          color="primary"
          sx={{
            height: 1,
            cursor: 'pointer',
            bgcolor: isActivated ? 'primary.light' : 'transparent',
          }}
          alignItems="center"
          onClick={event => {
            onClick?.({ event, id: data.id });
            handleClick();
          }}
        >
          <ListItemIcon sx={{ minWidth: 'unset' }}>
            <RenderIcon />
          </ListItemIcon>

          <ListItemText disableTypography sx={{ m: 0, fontSize: 12 }}>
            {data.label}
          </ListItemText>
        </ListItemButton>
      </ListItem>

      {hasChild && (
        <Collapse in={isOpen} unmountOnExit>
          {data.children?.map(item => {
            return (
              <TreeItem key={item.id} data={item} level={level + 1} {...restProps} />
            );
          })}
        </Collapse>
      )}
    </List>
  );
}
