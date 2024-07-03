import {
  ListRounded,
  ListOutlined,
  PeopleOutlined,
  PeopleRounded,
  SpaceDashboardOutlined,
  SpaceDashboardRounded,
  InsightsRounded,
  InsightsOutlined,
  LooksOneOutlined,
  LooksOneRounded,
} from '@mui/icons-material';
import { SvgIconProps } from '@mui/material';

type Props = {
  name: string;
} & SvgIconProps;

export function Icon({ name, ...props }: Props) {
  switch (name) {
    case 'insights':
      return <InsightsRounded {...props} />;
    case 'insights-outlined':
      return <InsightsOutlined {...props} />;
    case 'list':
      return <ListRounded {...props} />;
    case 'list-outlined':
      return <ListOutlined {...props} />;
    case 'looks-one':
      return <LooksOneRounded {...props} />;
    case 'looks-one-outlined':
      return <LooksOneOutlined {...props} />;
    case 'people':
      return <PeopleRounded {...props} />;
    case 'people-outlined':
      return <PeopleOutlined {...props} />;
    case 'space-dashboard':
      return <SpaceDashboardRounded {...props} />;
    case 'space-dashboard-outlined':
      return <SpaceDashboardOutlined {...props} />;
    default:
      return <></>;
  }
}
