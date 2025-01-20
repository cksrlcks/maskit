export const APP_TITLE = "MASKIT";
export const WELCOME_DONT_SHOW_PERIOD = 7;

export const MIN_BOTTOM_SPACE = 200;
export const VIEWPORT_FACTOR = 0.8;
export const PIXEL_RATIO = 2;
export const DEFAULT_COLOR = "#000";
export const DEFAULT_OPACITY = 1;
export const DEFAULT_SCALE_X = 1;
export const DEFAULT_SCALE_Y = 1;
export const DEFAULT_IMAGE_NAME = "maskit";
export const SUPPORT_LANG = ["kor", "eng"];
export const RECT_MIN_WIDTH = 5;
export const RECT_MIN_HEIGHT = 5;
export const MAX_DISPLAY_SCALE = 200;
export const MIN_DISPLAY_SCALE = 10;
export const SCALE_AMOUNT = 0.1;
export const OPACITY_AMOUNT = 0.1;
export const EMOJI_FONT_FAMILY = "Noto Color Emoji";
export const EMOJI_INITIAL_MIN_SIZE = 100;

export const TOAST_DURATION = 2000;

export const ALERT_LABEL_ACTION = "확인";
export const ALERT_LABEL_CANCEL = "취소";

export const COLOR_PALLET = ["#ffffff", "#000000", "#ef4444", "#fbbf24", "#4ade80", "#60a5fa"];

export const MESSAGE = {
  EXPORT: {
    SAVE_PRE: {
      TITLE: "이미지를 저장합니다.",
      DESC: "곧 이미지 저장이 시작됩니다.",
    },
    SHARE_NOT_SUPPORT: {
      TITLE: "문제가 발생했어요.",
      DESC: "공유하기가 지원되지 않는 브라우저입니다.",
    },

    SHARE_ERROR: {
      TITLE: "공유 중단",
      DESC: "공유하기를 중단하였거나 문제가 있습니다.",
    },
    COPY_ERROR: {
      TITLE: "문제가 발생했어요.",
      DESC: "예상치못한 에러가 발생하여, 이미지를 복사하지 못했습니다.",
    },
    COPY_SUCCESS: {
      TITLE: "복사 완료",
      DESC: "성공적으로 클립보드에 이미지를 복사했습니다.",
    },
    MAIL_SUCCESS: {
      TITLE: "복사 완료",
      DESC: "메일본문에 붙여넣기 해주세요",
    },
    KAKAO_SUCCESS: {
      TITLE: "복사 완료",
      DESC: "카카오톡 메세지에서 붙여넣기 해주세요.",
    },
  },
  OCR: {
    NOT_SUPPORT: {
      TITLE: "문자감지가 지원되지 않는 이미지 형식입니다.",
      DESC: "문자인식을 실패했습니다.",
    },
    ERROR: {
      TITLE: "자동감지 실패",
      DESC: "문자인식을 실패했습니다.",
    },
    EMPTY: {
      TITLE: "감지된 영역 없음",
      DESC: "문자인식이 잘 안되요.",
    },
  },
  UPLOAD: {
    PASTE_FAIL: {
      TITLE: "붙여넣기에 실패했습니다.",
      DESC: "붙여넣을수 없는 형식입니다.",
    },
    GOOGLE_DRIVE: {
      LOADING: "구글드라이브에서 데이터를 가져오고 있어요",
      FAIL: {
        TITLE: "권한이 없어요",
        DESC: "구글드라이브에서 데이터를 가져오는데 실패했어요",
      },
    },
    DROPBOX: {
      LOADING: "드롭박스에서 데이터를 가져오고 있어요",
      FAIL: {
        TITLE: "권한이 없어요",
        DESC: "드롭박스에서 데이터를 가져오는데 실패했어요",
      },
    },
  },
  RESET_ALERT: "작업중이던 내용이 사라집니다.",
};
