import { HttpError } from '@/domain/errors';
import { enqueueSnackbar } from 'notistack';

export async function enqueueSnackbarOnError<R>(
  callback: () => R,
  onError?: (error: unknown) => void,
) {
  try {
    return await callback();
  } catch (error) {
    if (onError) {
      onError(error);
    }

    enqueueSnackbar((error as HttpError).message, {
      variant: 'error',
      autoHideDuration: 4000,
    });
  }
}
