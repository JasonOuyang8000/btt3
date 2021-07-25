import styles from '../../styles/TrainingRecords.module.css';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import { Firebase, firestore, auth } from '../../lib/firebaseClient';
import { useRouter } from 'next/router';
import { runTransaction } from 'firebase/firestore';
import Navbar from '../../components/Navbar';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useAuth } from '../../lib/auth';
import Head from 'next/head';
function Trainingrecords() {
  const auth = useAuth();

  //QR States
  const liveLink = process.env.LINK || 'http://localhost:3000/trainingrecords/';
  const [qrCodeLink, setQrCodeLink] = useState({ download: null, href: null });
  const [urlLink, setUrlLink] = useState(null);

  // Profile State
  const [profile, setProfile] = useState({
    isProfile: false,
    certification: null,
  });

  // Router
  const router = useRouter();
  const { userid } = router.query;
  const usersRef = firestore.collection('profiles').doc(`${userid}-profile`);

  // User Hook
  const [user] = useAuthState(Firebase.auth());

  const checkUser = async () => {
    try {
      const response = await usersRef.get();
      console.log(response);
      if (response.exists) {
        const data = response.data();
        setProfile({ isProfile: true, certification: data.certification });
      } else {
        console.log('no');
      }
    } catch (error) {
      console.log('what happened');
      return;
    }
  };

  const handleDownloadLink = () => {
    if (urlLink) {
      const canvas = document.getElementById('qr-code');
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      setQrCodeLink({ download: 'qr-code.png', href: pngUrl });
    }
    return;
  };

  useEffect(() => {
    if (!auth) return;

    async function manageLoad() {
      // Check User
      await checkUser();
      // Get Download Link for Qr Code Maybe not for Training Records?
      await handleDownloadLink();
    }

    manageLoad();
  }, [auth]);

  useEffect(() => {
    if (!auth) return;
    setUrlLink(`${liveLink}${userid}`);
  }, [profile.certification, auth]);

  return (
    // Conditon Renders
    <>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (!document.cookie.includes('auth')) {
                window.location.href = "/"
              }
            `,
          }}
        />
      </Head>
      <Navbar>Training Records</Navbar>
      {!profile.isProfile ? (
        <div>Profile does not exist....</div>
      ) : (
        <div>
          <div className={styles.bttbg}>
            <p className={styles.profiletext}>
              <a className={styles.link} href='https://www.google.com'>
                Profile:
              </a>
              &nbsp; Zane is 5'4", 20 years old and has mild ADHD. She sometimes
              experiences hearing difficulties.
              <div className={styles.qrcode}>
                {urlLink && (
                  <>
                    <QRCode id='qr-code' value={urlLink} />
                    {qrCodeLink.download && (
                      <a
                        id='download-link'
                        download={qrCodeLink.download}
                        href={qrCodeLink.href}>
                        {' '}
                        Save QR as Image{' '}
                      </a>
                    )}
                  </>
                )}
              </div>
            </p>
            {/* Certificate */}
            {profile.certification ? (
              <main className={styles.certificate}>
                <div>
                  <p className={styles.title}>
                    CERTIFICATE OF COMPLETION
                    <p className={styles.description}>Beyond The Talk awards</p>
                  </p>
                  <div className={styles.title}>
                    Zane Joe
                    <p className={styles.description}>
                      for completing the Self Awareness course on 7/10/2021
                    </p>
                  </div>
                  <div className={styles.spacedtext}>
                    <p>
                      President
                      <p>John Doe</p>
                    </p>
                    <p>
                      Tutor
                      <p>Lee Mark</p>
                    </p>
                  </div>
                </div>
                <a className={styles.print}>Print Certificate</a>
              </main>
            ) : (
              <div></div>
            )}

            <div>
              {/* Reason For Traffic Stop Form */}
              <form className={styles.trafficstop}>
                <h2 className={styles.topleft}>Officer Name:</h2>
                <label className={styles.topleft} for='officerName'></label>
                <input
                  className={styles.topleftinput}
                  type='text'
                  id='officerName'
                  name='officerName'></input>{' '}
                <br />
                <h2 className={styles.topleft}>Badge Number:</h2>
                <label className={styles.topleft} for='badgeNumber'></label>
                <input
                  className={styles.topleftinput}
                  type='text'
                  id='badgeNumber'
                  name='badgeNumber'></input>{' '}
                <br />
                <h2 className={styles.topleft}>Reason for Traffic Stop:</h2>
                <label className={styles.topleft} for='reasonForStop'></label>
                <textarea
                  className={styles.topleftinput}
                  rows='5'
                  cols='34'
                  name='reasonForStop'></textarea>{' '}
                <br />
              </form>
              <button className={styles.submit} type='button'>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Trainingrecords;
