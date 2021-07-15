//
//
//   Application level email template with styles
//
//

const emailTemplate = (markup) => {
  return `
        <!DOCTYPE html>
<html lang="en">
<head>
<style>
*,
*::before,
*::after {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
}
</style>
    <style>
    @font-face {
        font-family: 'Montserrat';
        font-style: normal;
        font-weight: 300;
        font-display: swap;
        src: url(https://fonts.gstatic.com/s/montserrat/v15/JTURjIg1_i6t8kCHKm45_cJD3gnD_vx3rCs.woff2) format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
      @font-face {
        font-family: 'Montserrat';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url(https://fonts.gstatic.com/s/montserrat/v15/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff2) format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
    </style>
    <style>
    body {
        font-family: 'Montserrat', sans-serif;
        font-weight: 300;
        line-height: 1.5;
    
    }
    header {
        display: flex;
        padding: 2rem 0;
        margin-bottom: 2rem;
    }
    h1 {
        font-family: 'Montserrat', sans-serif;
        font-weight: 300;
        font-size: 1.7em;
        margin-bottom: 1rem;
        letter-spacing: 1px;
    }
    p {
        font-family: 'Montserrat', sans-serif;
        font-weight: 300;
        font-size: 1.2em;
        letter-spacing: 0.5px;
    }
    a {
        font-family: 'Montserrat', sans-serif;
        font-weight: 300;
        color: orange;
    }
    </style>
    </head>
    <body>
    <header><a href="https://tophoneys.com"><img src="https://tophoneys.com/logotranspbg.png" alt="logo" height="50px"></a></header>
    <main>
      ${markup}
    </main>
</body>
</html>
        `
}

module.exports = emailTemplate
