
export const COLORS = {
  GREEN: {
    BRIGHT: '#9BCA26',
    MEDIUM: '#15300D',
    DARK: '#0E2009',
  },
  GRAY: {
    LIGHTEST: '#F8FCEE',
    LIGHTMED: '#ADADAD',
    DARKEST: '#141414',
    BLACK: '#0A0A0A'
  },
  RED: {
    BRIGHT: '#CC2200',
  }
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
  color: '#488615',
  fontSize: 16,
  marginBottom: 5,
}

export const flexRow = {
  flexDirection: 'row'
}