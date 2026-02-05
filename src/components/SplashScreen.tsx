interface SplashScreenProps {
  isExiting?: boolean;
}

const SplashScreen = ({ isExiting = false }: SplashScreenProps) => {
  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-ui-bg transition-all duration-700 ease-in-out ${
        isExiting ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
    >
      <div
        className={`relative w-[80%] sm:w-[60%] md:max-w-md max-w-lg transition-all duration-700 ease-out ${
          isExiting
            ? "scale-90 opacity-0"
            : "scale-100 opacity-100 animate-logo-fade-in"
        }`}
      >
        <img
          src="/App-Logo.png"
          alt="App Logo"
          className="w-full h-auto object-contain drop-shadow-2xl"
        />
      </div>
    </div>
  );
};

export default SplashScreen;
