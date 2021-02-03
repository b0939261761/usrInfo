export const catchAsyncRoute = fn => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    next(err);
  }
};

export const zeroStart = (num, digits = 2) => num.toString().padStart(digits, '0');

export default {
  catchAsyncRoute,
  zeroStart
};
