export const Auth_page = ()=>{
    return(
        <>
        <section class="body-font relative text-gray-600">
  <div class="absolute inset-0 bg-gray-300">
    <iframe width="100%" height="100%" frameborder="0" marginheight="0" marginwidth="0" title="map" scrolling="no" src="https://img.freepik.com/free-vector/technological-background-network-connection_23-2148897767.jpg?t=st=1724481578~exp=1724485178~hmac=451feb2b80ef71aa82323140e0e80da3f66e89fa5c60b3f775694479d28ad802&w=1380" style={{filter: contrast(1.2)+opacity(0.7)}}></iframe>
  </div>
  <div class="container mx-auto flex px-5 py-24">
    <div class="relative z-10 mt-10 flex w-full flex-col rounded-lg bg-white p-8 shadow-md md:ml-auto md:mt-0 md:w-1/2 lg:w-1/3">
      <h2 class="title-font mb-1 text-lg font-medium text-gray-900">Sign In</h2>
      <p class="mb-5 leading-relaxed text-gray-600">log in to your account</p>
      <div class="relative mb-4">
        <label for="email" class="text-sm leading-7 text-gray-600">Email</label>
        <input type="email" id="email" name="email" class="w-full rounded border border-gray-300 bg-white px-3 py-1 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
      </div>
      <div class="relative mb-4">
        <label for="password" class="text-sm leading-7 text-gray-600">Password</label>
        <input type="password" id="email" name="email" class="w-full rounded border border-gray-300 bg-white px-3 py-1 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
      </div>
      <button class="rounded border-0 bg-indigo-500 px-6 py-2 text-lg text-white hover:bg-indigo-600 focus:outline-none">Button</button>
      <p class="mt-3 text-xs text-gray-500">Don't have an account Click here to create one</p>
    </div>
  </div>
</section>

        </>
    );
}