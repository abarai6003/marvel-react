import "./charList.scss"
import useMarvelService from "../../services/MarvelService"
import Spinner from "../spinner/Spinner"
import ErrorMessage from "../errorMessage/errorMessage"
import PropTypes from "prop-types"
import { useState, useEffect, useRef } from "react"

const CharList = props => {
	const [charList, setCharList] = useState([])
	const [offset, setOffset] = useState(210)
	const [newItemLoading, setNewItemLoading] = useState(false)
	const [charEnded, setCharEnded] = useState(false)

	const { loading, error, getAllCharacters } = useMarvelService()
	const itemsRef = useRef([])

	useEffect(() => {
		onRequest(offset, true)
	}, [])

	const onRequest = (offset, initial) => {
		initial ? setNewItemLoading(false) : setNewItemLoading(true)

		getAllCharacters(offset).then(onCharListLoaded)
	}

	const onCharListLoaded = charListData => {
		let ended = false
		if (charListData.length < 9) {
			ended = true
		}
		setCharList(charList => [...charList, ...charListData])
		setOffset(offset => offset + 9)
		setNewItemLoading(false)
		setCharEnded(CharEnded => ended)
	}

	const onCharFocused = id => {
		itemsRef.current.forEach(item =>
			item.classList.remove("char__item_selected")
		)
		itemsRef.current[id].classList.add("char__item_selected")
		itemsRef.current[id].focus()
	}

	function renderItems(arr) {
		const notExist =
			"http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
		const items = arr.map((item, i) => {
			const style =
				item.thumbnail === notExist
					? { objectFit: "contain" }
					: { objectFit: "cover" }
			return (
				<li
					className='char__item'
					key={item.id}
					// el is the link to the real dom element
					ref={el => (itemsRef.current[i] = el)}
					onClick={() => {
						props.onCharSelected(item.id)
						onCharFocused(i)
					}}
					onKeyDown={e => {
						if (e.key === " " || e.key === "Enter") {
							props.onCharSelected(item.id)
							onCharFocused(i)
						}
					}}>
					<img src={item.thumbnail} alt={item.name} style={style} />
					<div className='char__name'>{item.name}</div>
				</li>
			)
		})

		return <ul className='char__grid'>{items}</ul>
	}

	const elements = renderItems(charList)

	const errorMessage = error ? <ErrorMessage /> : null
	const spinner = loading && !newItemLoading ? <Spinner /> : null

	return (
		<div className='char__list'>
			{errorMessage}
			{spinner}
			{elements}
			<button
				className='button button__main button__long'
				onClick={() => onRequest(offset)}
				disabled={newItemLoading}
				style={{ display: charEnded ? "none" : "block" }}>
				<div className='inner'>load more</div>
			</button>
		</div>
	)
}

CharList.propTypes = {
	onCharSelected: PropTypes.func.isRequired
}
export default CharList
