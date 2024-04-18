import Footers from './components/footer';
import Headers from './components/hearder'

export default function TestLayout({ children }) {
    return (
        <section>
            <Headers />
            <main className="mt-5">
                {children}
            </main>
            <Footers />
        </section>
    );
}