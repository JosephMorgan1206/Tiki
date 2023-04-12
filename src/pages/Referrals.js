// material
import { Container, Typography, Alert, AlertTitle, Box, Stack, Chip, Button } from '@mui/material';
import { DoneRounded, CloseRounded } from '@mui/icons-material';
// hooks
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import HeaderBanner from '../components/HeaderBanner';

// ----------------------------------------------------------------------

export default function Referrals({ wallet, address }) {
  const { themeStretch } = useSettings();
  const settings = {
    dots: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    infinite: false,
    responsive: [
      {
        breakpoint: 1626,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 796,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  const referralTiers = [
    {
      name: 'TIKI Totem',
      cost: 0,
      image: '/static/referral/rank_1_banner.jpg',
      color: 'rgba(145, 158, 171, 0.16)',
      benefits: [
        {
          text: 'Access to the TIKI Referral Program (Requires 100,000 TIKI in wallet)',
          active: true
        },
        {
          text: 'Refer others with unique referral link to buy TIKI (with reduced 10% fee)',
          active: true
        },
        {
          text: `Gain 5% commission in BNB on your referal's buys via TIKI Dash`,
          active: true
        },
        {
          text: `Gain access to exclusive competitions for BONUS rewards`,
          active: true
        },
        {
          text: `Gain 2% BONUS of your referral's TIKI Stash token rewards (coming soon)`,
          active: true
        },
        {
          text: `Gain BONUS token rewards in the TIKI Stash (coming soon)`,
          active: false
        },
        {
          text: `Gain access to exclusive competitions for BONUS rewards`,
          active: false
        },
        {
          text: `Gain a PERMANENT discount on TIKI Token buys via TIKI Dash`,
          active: false
        },
        {
          text: `Unique Telegram and Discord Rank and Title`,
          active: false
        }
      ]
    },
    {
      name: 'TIKI Warrior',
      cost: 2,
      image: '/static/referral/rank_2_banner.jpg',
      color: '#48b374',
      benefits: [
        {
          text: `Gain 6% commission in BNB on your referal's buys via TIKI Dash`,
          active: true
        },
        {
          text: `Gain access to exclusive competitions for BONUS rewards`,
          active: true
        },
        {
          text: `Gain 2% BONUS of your referral's TIKI Stash token rewards (coming soon)`,
          active: true
        },
        {
          text: `Gain BONUS 3% token rewards in the TIKI Stash (coming soon)`,
          active: true
        },
        {
          text: `Gain a 2% PERMANENT discount on TIKI Token buys via TIKI Dash (13% BUY FEE)`,
          active: true
        },
        {
          text: `And much more to come...`,
          active: true
        },
        {
          text: `Unique Telegram and Discord Rank and Title`,
          active: false
        }
      ]
    },
    {
      name: 'TIKI Titan',
      cost: 5,
      image: '/static/referral/rank_3_banner.jpg',
      color: '#4581af',
      benefits: [
        {
          text: `Gain 7% commission in BNB on your referal's buys via TIKI Dash`,
          active: true
        },
        {
          text: `Gain access to exclusive competitions for BONUS rewards`,
          active: true
        },
        {
          text: `Gain 2% BONUS of your referral's TIKI Stash token rewards (coming soon)`,
          active: true
        },
        {
          text: `Gain BONUS 5% token rewards in the TIKI Stash (coming soon)`,
          active: true
        },
        {
          text: `Gain a 4% PERMANENT discount on TIKI Token buys via TIKI Dash (11% BUY FEE)`,
          active: true
        },
        {
          text: `Unique Telegram and Discord Rank and Title`,
          active: true
        },
        {
          text: `And much more to come...`,
          active: true
        }
      ]
    },
    {
      name: 'TIKI Master',
      cost: 10,
      image: '/static/referral/rank_4_banner.jpg',
      color: '#7049a7',
      benefits: [
        {
          text: `Gain 8% commission in BNB on your referal's buys via TIKI Dash`,
          active: true
        },
        {
          text: `Gain access to exclusive competitions for BONUS rewards`,
          active: true
        },
        {
          text: `Gain 2% BONUS of your referral's TIKI Stash token rewards (coming soon)`,
          active: true
        },
        {
          text: `Gain BONUS 13% token rewards in the TIKI Stash (coming soon)`,
          active: true
        },
        {
          text: `Gain a 8% PERMANENT discount on TIKI Token buys via TIKI Dash (7% BUY FEE)`,
          active: true
        },
        {
          text: `Unique Telegram and Discord Rank and Title`,
          active: true
        },
        {
          text: `And much more to come...`,
          active: true
        }
      ]
    },
    {
      name: 'TIKI Legend',
      cost: 25,
      image: '/static/referral/rank_5_banner.jpg',
      color: '#b35337',
      benefits: [
        {
          text: `Gain 9% commission in BNB on your referal's buys via TIKI Dash`,
          active: true
        },
        {
          text: `Gain access to exclusive competitions for BONUS rewards`,
          active: true
        },
        {
          text: `Gain 2% BONUS of your referral's TIKI Stash token rewards (coming soon)`,
          active: true
        },
        {
          text: `Gain BONUS 20% token rewards in the TIKI Stash (coming soon)`,
          active: true
        },
        {
          text: `Gain a 14% PERMANENT discount on TIKI Token buys via TIKI Dash (1% BUY FEE)`,
          active: true
        },
        {
          text: `Unique Telegram and Discord Rank and Title`,
          active: true
        },
        {
          text: `And much more to come...`,
          active: true
        }
      ]
    }
  ];

  return (
    <Page title="Referrals | TIKI Dash">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBanner text="TIKI Token Referral Program" />
        <Alert sx={{ marginTop: '16px' }} severity="info">
          <AlertTitle>Coming soon</AlertTitle>
          <Typography>
            The first ever TIKI Referral System is on its way! Refer others to buy TIKI token with lowered trading fees!
            By making a referral, you'll gain additional BNB rewards, grow in rank, and earn even more rewards! To learn
            more, read the below information on our Referral Ranking System (note that the information below is subject
            to change).
          </Typography>
        </Alert>
        <Slider style={{ marginTop: '16px', marginLeft: '12px', marginRight: '12px' }} {...settings}>
          {referralTiers.map((tier, index) => (
            <Stack direction="column" alignItems="center" rowSpacing={2} sx={{ borderRadius: '16px' }}>
              <Box sx={{ width: '100%', padding: '0 12px' }}>
                <img
                  src={tier.image}
                  alt={`rank ${index + 1}`}
                  style={{
                    height: '165px',
                    width: '100%',
                    objectFit: 'cover',
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px',
                    borderBottom: `6px solid ${tier.color}`
                  }}
                />
                <Box
                  sx={{
                    backgroundColor: '#252b32',
                    padding: '32px 28px',
                    borderBottomLeftRadius: '16px',
                    borderBottomRightRadius: '16px'
                  }}
                >
                  <Typography component="h2" variant="h3" borderBottom={1}>
                    TIKI Referral Rank: {index + 1}
                  </Typography>

                  <Stack spacing={2} marginTop={3}>
                    <Chip sx={{ backgroundColor: tier.color }} label={tier.name} />
                    <Chip label={tier.cost === 0 ? `Unlock: HOLD 100,000 TIKI` : `Unlock: Refer ${tier.cost} BNB`} />
                  </Stack>

                  <Stack spacing={2} marginTop={3}>
                    {tier.benefits.map((benefit) => (
                      <Box display="flex">
                        {!benefit.active ? (
                          <CloseRounded sx={{ color: 'red', marginRight: '6px' }} />
                        ) : (
                          <DoneRounded sx={{ color: 'green', marginRight: '6px' }} />
                        )}
                        <Typography>{benefit.text}</Typography>
                      </Box>
                    ))}
                    <Button variant="contained" size="large" color="primary" disabled>
                      {index === 0 ? 'Join Referral Program' : `Upgrade to ${tier.name}`}
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </Stack>
          ))}
        </Slider>
      </Container>
    </Page>
  );
}
