import { Helmet } from 'react-helmet-async';
import { useGetDetailProfileAPi } from 'src/api/profile.api';
import { LoadingScreen } from 'src/components/loading-screen';
import { useParams } from 'src/routes/hooks';
// sections
import { EditProfileView } from 'src/sections/profile/view';

// ----------------------------------------------------------------------

export default function EditProfilePage() {
  const { profileId } = useParams();

  const { profileDetail, profileDetailLoading } = useGetDetailProfileAPi(profileId);

  return (
    <>
      <Helmet>
        <title>MKTLogin CMS: Edit profile</title>
      </Helmet>

      {profileDetailLoading ? (
        <LoadingScreen />
      ) : (
        <EditProfileView currentProfile={profileDetail} />
      )}
    </>
  );
}
