import { List, ListItem, SvgIconProps } from '@mui/material';
import { ITreeItemProps, TreeItem } from './TreeItem';

export interface ITreeData {
  id: string | number;
  children?: ITreeData[];
  label: string;
  icon?: {
    default?: React.FC<SvgIconProps>;
    expanded?: React.FC<SvgIconProps>;
    collapsed?: React.FC<SvgIconProps>;
  };
}

export interface ITreeProps<T extends ITreeData> {
  data: T[];
  itemProps?: ITreeItemProps;
}

export function Tree<T extends ITreeData>(props: ITreeProps<T>) {
  const { data, itemProps } = props;

  return (
    <List disablePadding dense sx={{ width: 1 }}>
      {data.map(item => {
        return (
          <ListItem key={item.id} dense disableGutters disablePadding sx={{ width: 1 }}>
            <TreeItem data={item} level={1} {...itemProps} />
          </ListItem>
        );
      })}
    </List>
  );
}
