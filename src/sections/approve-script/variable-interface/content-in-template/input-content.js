import { IconButton, Stack, TextField, Typography, alpha } from '@mui/material';
import Iconify from 'src/components/iconify';
import WithSectionAction from '../components/WithSelectionAction';

const PropTypes = require('prop-types');

const InputContent = ({ data, selectingItem }) => (
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
      <Stack
        direction="row"
        spacing={0}
        sx={{
          transition: 'all 0.3s',
          width: '100%',
          ...(data?.config?.width && {
            width: `${data?.config?.width}px`,
          }),
        }}
      >
        <TextField
          value={data?.config?.defaultValue}
          size="small"
          sx={{
            width: '100%',

            ...(data?.config?.rightButton && {
              width: 'calc(100% - 37.13px)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              },
            }),
          }}
          inputProps={{
            readOnly: true,
          }}
          placeholder={data?.config?.placeholder}
          InputProps={{
            endAdornment: (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  ...(!data?.config?.showTextCount && {
                    display: 'none',
                  }),
                }}
              >{`${data?.config?.defaultValue.length}/${data?.config?.maxLength ?? 0}`}</Typography>
            ),
          }}
        />
        {data?.config?.rightButton && data?.config?.acceptType === 'folder' && (
          <IconButton
            sx={{
              width: 37.13,
              height: 37.13,
              flexShrink: 0,
              borderRadius: 1,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              border: '1px solid',
              borderLeft: 'none',
              borderColor: (theme) => alpha(theme.palette.grey[500], 0.32),
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.06),
            }}
            disabled
          >
            <Iconify icon="line-md:folder-twotone" width={26} />
          </IconButton>
        )}
        {data?.config?.rightButton && data?.config?.acceptType !== 'folder' && (
          <IconButton
            variant="outlined"
            component="label"
            sx={{
              width: 37.13,
              height: 37.13,
              flexShrink: 0,
              borderRadius: 1,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              border: '1px solid',
              borderLeft: 'none',
              borderColor: (theme) => alpha(theme.palette.grey[500], 0.32),
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.06),
            }}
            disabled
          >
            <Iconify icon="line-md:folder-twotone" width={26} />
            <input type="file" accept={data?.config?.acceptType} hidden />
          </IconButton>
        )}
      </Stack>
    </Stack>
  </WithSectionAction>
);

InputContent.propTypes = {
  data: PropTypes.object,
  selectingItem: PropTypes.object,
};

export default InputContent;
