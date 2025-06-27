import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// components
import Iconify from 'src/components/iconify';
import { Typography } from '@mui/material';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { shortDateLabel } from 'src/components/custom-date-range-picker';

// ----------------------------------------------------------------------

export const SCRIPT_TYPE = [
  { id: 'flowchart', name: 'Flowchart' },
  { id: 'script', name: 'Script' },
];

export default function ListScriptTableFiltersResult({
  filters,
  onFilters,
  //
  onResetFilters,
  //
  results,
  ...other
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const shortLabel = shortDateLabel(
    filters.start_date,
    filters.end_date,
    "d 'tháng' M yyyy",
    "d 'tháng' M"
  );

  const handleRemoveUserCreated = () => {
    onFilters('user_created', '');
  };

  const handleRemoveUserOwner = () => {
    onFilters('user_owner', '');
  };

  const handleRemoveType = () => {
    onFilters('type', '');
  };

  const handleRemoveSearch = () => {
    onFilters('search', '');
  };

  const handleRemoveName = () => {
    onFilters('name', '');
  };

  const handleRemoveCategory = () => {
    onFilters('workflow_category_id', '');
  };

  const handleRemoveDate = () => {
    onFilters('start_date', null);
    onFilters('end_date', null);
    searchParams.delete('start_date');
    searchParams.delete('end_date');
    router.push(`${paths.dashboard.script.list}?${searchParams}`);
  };

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          Kết quả tìm kiếm
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {filters.user_created && (
          <Block label="Người tạo:">
            <Chip size="small" label={filters.user_created} onDelete={handleRemoveUserCreated} />
          </Block>
        )}

        {filters.user_owner && (
          <Block label="Người sở hữu:">
            <Chip size="small" label={filters.user_owner} onDelete={handleRemoveUserOwner} />
          </Block>
        )}

        {filters.name && (
          <Block label="Tên script:">
            <Chip size="small" label={filters.name} onDelete={handleRemoveName} />
          </Block>
        )}

        {filters.type && (
          <Block label="Loại script:">
            <Chip
              size="small"
              label={SCRIPT_TYPE.find((item) => item.id === filters.type)?.name}
              onDelete={handleRemoveType}
            />
          </Block>
        )}

        {filters.search && (
          <Block label="Người tạo:">
            <Chip size="small" label={filters.search} onDelete={handleRemoveSearch} />
          </Block>
        )}

        {filters.workflow_category_id && (
          <Block label="Danh mục:">
            <Chip
              size="small"
              label={filters.workflow_category_id.split('-')?.[1]}
              onDelete={handleRemoveCategory}
            />
          </Block>
        )}

        {(filters.start_date || filters.end_date) && (
          <Block label="Ngày tạo:">
            <Chip size="small" label={shortLabel} onDelete={handleRemoveDate} />
          </Block>
        )}

        <Button
          color="error"
          onClick={() => {
            searchParams.delete('transaction_type');
            searchParams.delete('page');
            router.push(`${paths.dashboard.transaction_history.deduction}?${searchParams}`);
            onResetFilters();
          }}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Loại bỏ
        </Button>
      </Stack>
    </Stack>
  );
}

ListScriptTableFiltersResult.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  onResetFilters: PropTypes.func,
  results: PropTypes.number,
};

// ----------------------------------------------------------------------

function Block({ label, children, sx, ...other }) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Typography variant="subtitle2">{label}</Typography>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}

Block.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  sx: PropTypes.object,
};
