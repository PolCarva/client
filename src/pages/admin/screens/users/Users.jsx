import { useDataTable } from '../../../../hooks/useDataTable';
import { deleteUser, getAllUsers } from '../../../../services/index/users';
import DataTable from '../../components/DataTable';
import { Link } from 'react-router-dom';
import { images, stable } from '../../../../constants';

const Users = () => {
    const {
        userState,
        currentPage,
        setCurrentPage,
        searchKeyword,
        data: usersData,
        isLoading,
        isFetching,
        isLoadingDeleteData,
        queryClient,
        searchKeywordHandler,
        submitSearchKeywordHandler,
        deleteDataHandler,
      } = useDataTable({
        dataQueryFn: () =>
          getAllUsers(
            userState.userInfo.token, 
            searchKeyword,
            currentPage
          ),
        dataQueryKey: "users",
        mutateDeleteFn: ({ slug, token }) => {
          return deleteUser({ slug, token });
        },
        deleteDataMessage: "User deleted successfully",
      });
    
      return (
        <DataTable
          pageTitle={"Manage Users"}
          dataListName={"Users"}
          searchInputPlaceHolder={"Username's email..."}
          searchKeywordOnSubmitHandler={submitSearchKeywordHandler}
          searchKeywordOnChangeHandler={searchKeywordHandler}
          searchKeyword={searchKeyword}
          tableHeaderTitleList={[
            "Name",
            "Email",
            "Created At",
            "Verified",
            "Admin",
            "",
          ]}
          isLoading={isLoading}
          isFetching={isFetching}
          data={usersData}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          headers={usersData?.headers}
          userState={userState}
        >
          {usersData?.data.map((user) => (
            <tr key={user._id}>
              <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Link to={`/`} className="relative block">
                      <img
                        alt={user?.name}
                        src={
                          user?.avatar
                            ? stable.UPLOAD_FOLDER_BASE_URL + user?.avatar
                            : images.defaultProfile
                        }
                        className="mx-auto object-cover rounded-lg aspect-square w-10 "
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = images.samplePostImage;
                        }}
                      />
                    </Link>
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {user?.name}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p className="text-gray-900 whitespace-no-wrap flex flex-wrap gap-1">
                  {user?.email}
                </p>
              </td>
              <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <p className="text-gray-900 whitespace-no-wrap">
                  {new Date(user?.createdAt).toLocaleDateString()}
                </p>
              </td>
              <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p className="text-gray-900 whitespace-no-wrap">
                  {user?.verified ? "✅" : "❌"}
                </p>
              </td>
              <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p className="text-gray-900 whitespace-no-wrap">
                  {user?.op ? "👑" : user?.admin ? "✅" : "❌"}
                </p>
              </td>
              <td className="space-x-5 px-5 py-5 text-sm bg-white border-b border-gray-200">
                <button
                  type="button"
                  disabled={
                    isLoadingDeleteData ||
                    user.op || // Si el usuario actual es OP, deshabilita el botón
                    user._id === userState.userInfo._id || // Si el usuario actual es el mismo que el objetivo, deshabilita el botón
                    (user.admin && !userState.userInfo.op) || // Si el usuario actual es admin y el usuario objetivo no es OP, deshabilita el botón
                    (!userState.userInfo.op && !userState.userInfo.admin) // Si el usuario actual no es OP ni admin, deshabilita el botón
                  }                  className="text-red-600 hover:text-red-900 disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={() =>
                    deleteDataHandler({
                      token: userState.userInfo.token,
                      slug: user?._id,
                    })
                  }
                >
                  Delete
                </button>
                
              </td>
            </tr>
          ))}
        </DataTable>
      );
}

export default Users