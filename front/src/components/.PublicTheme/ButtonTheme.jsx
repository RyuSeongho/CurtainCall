import { createTheme } from '@mui/material/styles';

export const ButtonTheme = createTheme({
    typography: {
        fontFamily: 'RIDIBatang', // 'RIDIBatang' 폰트를 기본 폰트로 설정
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    border: '1px solid black',
                    width: '40vw',
                    maxWidth: '600px',
                    height: '6vh',
                    borderRadius: '0px',
                    fontSize: '2.5vh',
                    position: 'relative',
                    transition: 'background-color 0.5s ease',
                    marginLeft: '0.25vw',
                    '&:hover': {
                        boxShadow: 'none',  // 호버 상태에서 그림자 없애기
                    },
                    '@media (max-width: 1920px)': {
                        fontSize: '2.5vh',
                        marginTop: '0.25vw',
                    },
                    '@media (max-width: 900px)': {
                        maxWidth: '900px',
                        fontSize: '2.0vh',
                        height: '5.4vh',
                        width: '66.6vw',
                        marginTop: '0.25vw',
                    },
                    '@media (max-width: 600px)': {
                        maxWidth: '900px',
                        fontSize: '1.8vh',
                        height: '5.4vh',
                        width: '66.6vw',
                        marginTop: '0.25vw',
                    }
                }
            }
        }
    }
});