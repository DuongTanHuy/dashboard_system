import { Checkbox, FormControlLabel, FormGroup, Stack, Typography } from '@mui/material';
import WithSectionAction from '../components/WithSelectionAction';

const PropTypes = require('prop-types');

const CheckboxContent = ({ data, selectingItem }) => (
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
        sx={{
          transition: 'all 0.3s',
          flex: 1,
          ml: `${data?.config?.width}px`,
          pl: 1,
        }}
      >
        <FormGroup row>
          {data?.config?.options.map((option) => (
            <FormControlLabel
              key={option.id}
              control={
                <Checkbox
                  checked={data?.config?.defaultValue?.includes(option.value)}
                  inputProps={{
                    readOnly: true,
                  }}
                />
              }
              label={option.label}
            />
          ))}
        </FormGroup>
      </Stack>
    </Stack>
  </WithSectionAction>
);

CheckboxContent.propTypes = {
  data: PropTypes.object,
  selectingItem: PropTypes.object,
};

export default CheckboxContent;
