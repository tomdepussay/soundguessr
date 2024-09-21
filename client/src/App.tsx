import Background from '@background/Background';

function App(){
    return (
        <div className="h-screen w-screen overflow-hidden">

          <Background />

          <main className='h-screen w-screen overflow-auto absolute top-0 left-0'>
            
          </main>

        </div>
    )
}

export default App;