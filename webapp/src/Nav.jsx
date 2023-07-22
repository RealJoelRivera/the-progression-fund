

export default function Nav() {
    
  return (<>
    
    <nav class="flex flex-wrap items-center justify-between p-4 bg-white dark:bg-gray-700">
        <div class="w-auto lg:order-2 lg:w-1/5 lg:text-center">
            <a class="text-xl font-semibold font-heading" href="#">
                The Progression Fund
            </a>
        </div>
        <div class="block lg:hidden">
            <button class="flex items-center px-3 py-2 text-white border rounded navbar-burger">
                <svg class="w-3 h-3 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <title>
                        Menu
                    </title>
                    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z">
                    </path>
                </svg>
            </button>
        </div>
        <div class="hidden w-full navbar-menu lg:order-1 lg:block lg:w-2/5">
            <a class="block mt-4 mr-10 text-black-900 lg:inline-block lg:mt-0 hover:text-red-600" href="#">
                Home
            </a>
            <a class="block mt-4 mr-10 text-black-900 lg:inline-block lg:mt-0 hover:text-red-600" href="#">
                Performance
            </a>
            <a class="block mt-4 text-black-900 lg:inline-block lg:mt-0 hover:text-red-600" href="#">
                Account
            </a>
        </div>
        <div class="hidden w-full navbar-menu lg:order-3 lg:flex lg:w-2/5 lg:text-right mr-4 sm:mr-0 justify-end sm:right-auto" id="profileicon">
              <a href="#" className="relative block">
                  <img alt="profile" src="https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png" className="mx-auto object-cover rounded-full h-10 w-10 "/>
              </a>
        </div>
    </nav>

  </>)
}

//<div className="relative flex items-center justify-end w-1/4 p-1 ml-5 mr-4 sm:mr-0 sm:right-auto">