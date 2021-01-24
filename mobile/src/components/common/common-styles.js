
export const COLORS = {
  GREEN: {
    BRIGHT: '#9BCA26',
    MEDIUM: '#15300D',
    MEDIUM2: '#488615',
    DARK: '#0E2009',
  },
  GRAY: {
    LIGHTEST: '#F8FCEE',
    LIGHTMED: '#ADADAD',
    DARKEST: '#141414',
    BLACK: '#0A0A0A'
  },
  RED: {
    BRIGHTEST: '#FF330A',
    BRIGHT: '#CC2200',
    MEDIUM: '#520E00',
  }
}

export const headerText = { 
  textAlign: 'center',
  color: COLORS.GRAY.LIGHTMED, 
  fontWeight: 'bold', 
  fontSize: 20 
};

export const wateringCellBase = {
  height: 100,
  width: 100,
  borderRadius: 100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  shadowOffset: {
    width: 0,
    height: 0
  },
  shadowOpacity: 0.5,
  shadowRadius: 3.84,
};

export const wateringCellPending = {
  ...wateringCellBase,
  backgroundColor: COLORS.GRAY.DARKEST,
  borderColor: COLORS.GREEN.BRIGHT,
  borderWidth: 1,
  color: COLORS.GREEN.BRIGHT,
  shadowColor: COLORS.GREEN.BRIGHT,
}

export const wateringCellComplete = {
  ...wateringCellBase,
  backgroundColor: COLORS.GREEN.MEDIUM,
  borderColor: COLORS.GREEN.BRIGHT,
  borderWidth: 1,
  color: COLORS.GREEN.BRIGHT,
  shadowColor: COLORS.GREEN.BRIGHT,
}

export const wateringCellMissed = {
  ...wateringCellBase,
  backgroundColor: COLORS.RED.MEDIUM,
  borderColor: COLORS.RED.BRIGHTEST,
  borderWidth: 1,
  color: COLORS.RED.BRIGHTEST,
  shadowColor: COLORS.RED.BRIGHTEST,
}


export const mainView = {
  backgroundColor: COLORS.GREEN.DARK,
  color: COLORS.GREEN.BRIGHT,
  height: '100%',
  flex: 1
};

export const mainViewFlex = {
  backgroundColor: COLORS.GREEN.DARK,
  color: COLORS.GREEN.BRIGHT,
  flex: 1, 
  justifyContent: 'space-between', 
  alignItems: 'center',
};

export const defaultHeaderStyleOptions = {
  headerStyle: {
    backgroundColor:  COLORS.GRAY.DARKEST,
    shadowColor: 'transparent' 
  },
  headerTintColor: COLORS.GREEN.BRIGHT,
}

export const labelText = {
  color: COLORS.GREEN.MEDIUM2,
  fontSize: 16,
  marginBottom: 5,
}

export const flexRow = {
  flexDirection: 'row'
}

export const FONT_SIZES = {
  XLARGE: 32,
  LARGE: 20,
  MEDLARGE: 18,
  MEDIUM: 16,
  SMALL: 14,
  XSMALL: 12,
};

export const PADDING = {
  LARGE: 30,
  MEDIUM: 20,
  MEDSMALL: 14,
  SMALL: 10,
  XSMALL: 6,
}