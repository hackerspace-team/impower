import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FontIcon } from "../../impower-icon";
import { DrawerMenu } from "../../impower-route";
import { DrawerMenuProps } from "../../impower-route/components/popups/DrawerMenu";

const StyledFilterTypography = styled(Typography)`
  padding: ${(props): string => props.theme.spacing(1, 3, 2, 3)};
  font-weight: ${(props): number => props.theme.fontWeight.semiBold};
`;

const StyledFontIconArea = styled.div`
  padding-right: ${(props): string => props.theme.spacing(1.5)};
  display: flex;
  align-items: center;
  min-width: ${(props): string => props.theme.spacing(4)};
  min-height: ${(props): string => props.theme.spacing(4)};
`;

interface FilterMenuItemProps extends DrawerMenuProps {
  option: string;
  label: string;
  icon?: React.ReactNode;
  activeFilterValue?: string;
  onOption?: (e: React.MouseEvent, option: string) => void;
}

const FilterMenuItem = React.memo((props: FilterMenuItemProps): JSX.Element => {
  const { option, label, icon, activeFilterValue, onOption } = props;

  const theme = useTheme();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (onOption) {
        onOption(e, option);
      }
    },
    [onOption, option]
  );

  const menuItemStyle: React.CSSProperties = useMemo(
    () => ({
      backgroundColor: activeFilterValue === option ? "#edf3f8" : undefined,
      color:
        activeFilterValue === option ? theme.palette.primary.main : undefined,
    }),
    [activeFilterValue, option, theme.palette.primary.main]
  );

  const iconStyle: React.CSSProperties = useMemo(
    () => ({
      opacity: activeFilterValue === option ? undefined : 0.6,
    }),
    [activeFilterValue, option]
  );

  return (
    <MenuItem
      key={option}
      onClick={handleClick}
      selected={activeFilterValue === option}
      style={menuItemStyle}
    >
      <StyledFontIconArea>
        <FontIcon
          aria-label={label}
          size={theme.fontSize.regular}
          style={iconStyle}
        >
          {icon}
        </FontIcon>
      </StyledFontIconArea>
      {label}
    </MenuItem>
  );
});

interface FilterMenuProps extends DrawerMenuProps {
  filterLabel?: string;
  activeFilterValue?: string;
  options?: [
    string,
    {
      label: string;
      icon?: React.ReactNode;
    }
  ][];
  onOption?: (e: React.MouseEvent, option: string) => void;
}

const FilterMenu = React.memo(
  (props: PropsWithChildren<FilterMenuProps>): JSX.Element => {
    const {
      filterLabel,
      activeFilterValue,
      anchorEl,
      open,
      options,
      onClose,
      onOption,
    } = props;

    const [openState, setOpenState] = useState(false);

    useEffect(() => {
      setOpenState(open);
    }, [open]);

    return (
      <DrawerMenu anchorEl={anchorEl} open={openState} onClose={onClose}>
        <StyledFilterTypography>{filterLabel}</StyledFilterTypography>
        {options.map(([option, { label, icon }]) => (
          <FilterMenuItem
            key={option}
            option={option}
            label={label}
            icon={icon}
            activeFilterValue={activeFilterValue}
            onOption={onOption}
          />
        ))}
      </DrawerMenu>
    );
  }
);

export default FilterMenu;
