import { ButtonGroup, IconButton, Stack, TextField, Typography } from '@mui/material';
import Iconify from 'src/components/iconify';
import WithSectionAction from '../components/WithSelectionAction';

const PropTypes = require('prop-types');

const InputNumberContent = ({ data, selectingItem }) => (
  <WithSectionAction isActive={data.id === selectingItem?.id}>
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      sx={{
        ...data?.styleDefault,
        width: '100%',
        overflow: 'hidden',
        height: `${data?.config?.height}px`,
        transition: 'all 0.3s',
      }}
    >
      {!data?.config?.hideLabel && (
        <Typography
          sx={{
            minWidth: '100px',
            width: `${data?.config?.labelWidth}px`,
            transition: 'all 0.3s',
            flexShrink: 0,
          }}
        >
          {data?.config?.name}
        </Typography>
      )}

      <TextField
        value={data?.config?.defaultValue}
        size="small"
        type="number"
        fullWidth
        sx={{
          transition: 'all 0.3s',
          ...(data?.config?.width && {
            width: `${data?.config?.width}px`,
          }),
        }}
        inputProps={{
          readOnly: true,
        }}
        placeholder={data?.config?.placeholder}
        onWheel={(e) => {
          e.target.blur();
        }}
        InputProps={{
          endAdornment: (
            <ButtonGroup
              variant="outlined"
              sx={{
                ...(!data?.config?.showButton && {
                  display: 'none',
                }),
              }}
            >
              <IconButton disabled>
                <Iconify icon="ic:round-minus" />
              </IconButton>
              <IconButton disabled>
                <Iconify icon="ic:round-plus" />
              </IconButton>
            </ButtonGroup>
          ),
        }}
      />
    </Stack>
  </WithSectionAction>
);

InputNumberContent.propTypes = {
  data: PropTypes.object,
  selectingItem: PropTypes.object,
};

export default InputNumberContent;
